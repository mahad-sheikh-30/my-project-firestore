import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import "./AdminForms.css";
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../api/teacherApi";

import toast from "react-hot-toast";
import AppDataTable from "../../components/AppDataTable/AppDataTable";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";

interface TeacherFormInputs {
  id?: string;
  name: string;
  role: string;
  rating: number;
  image: FileList;
}

const teacherColumns = [
  { name: "Name", selector: (row: any) => row.name, sortable: true },
  { name: "Role", selector: (row: any) => row.role, sortable: true },
  { name: "Rating", selector: (row: any) => row.rating, sortable: true },
];

const TeachersAdmin: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TeacherFormInputs>({
    defaultValues: {
      name: "",
      role: "",
      rating: 0,
    },
  });

  const queryClient = useQueryClient();

  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
  });

  const loading = teachersLoading;

  const createMutation = useMutation({
    mutationFn: (form: FormData) => createTeacher(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher added!");
    },
    onError: () => toast.error("Failed to add teacher!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updateTeacher(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher updated!");
    },
    onError: () => toast.error("Failed to update teacher!"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      toast.success("Teacher deleted!");
    },
    onError: () => toast.error("Failed to delete teacher"),
  });

  const handleEdit = (teacher: any) => {
    setValue("id", teacher.id);
    setValue("name", teacher.name);
    setValue("role", teacher.role);
    setValue("rating", teacher.rating);
    setImagePreview(teacher.image || null);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this teacher?"))
      return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error deleting teacher:", err);
    }
  };

  const onSubmit = async (data: TeacherFormInputs) => {
    try {
      const fileData = new FormData();
      fileData.append("name", data.name);
      fileData.append("role", data.role);
      fileData.append("rating", String(data.rating));

      const imageFile = data.image?.[0];
      if (imageFile) {
        fileData.append("image", imageFile);
      }

      if (isEditing && data.id) {
        await updateMutation.mutateAsync({ id: data.id, form: fileData });
      } else {
        await createMutation.mutateAsync(fileData);
      }

      reset();
      setImagePreview(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error adding/updating teacher:", err);
    }
  };

  return (
    <>
      <h1 className="main-h">Manage Teachers</h1>

      <div className="list">
        <h2>{isEditing ? "Update " : "Add "}Teacher</h2>
        <hr />
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <label>
              Instructor Name
              <input
                type="text"
                placeholder="Instructor Name"
                {...register("name", {
                  required: "Instructor Name is required",
                })}
              />
            </label>
            {errors.name && (
              <p className="error-message">{errors.name.message}</p>
            )}

            <label>
              Role
              <input
                type="text"
                placeholder="Role"
                {...register("role", { required: "Role is required" })}
              />
            </label>
            {errors.role && (
              <p className="error-message">{errors.role.message}</p>
            )}
          </div>

          <div className="form-row">
            <label>
              Rating
              <input
                type="number"
                placeholder="Rating"
                {...register("rating", {
                  required: "Rating is required",
                  min: { value: 0, message: "Min rating is 0" },
                  max: { value: 5, message: "Max rating is 5" },
                  valueAsNumber: true,
                })}
                step="0.1"
              />
            </label>
            {errors.rating && (
              <p className="error-message">{errors.rating.message}</p>
            )}

            <label>
              Image
              <input
                type="file"
                {...register("image", {
                  required: isEditing ? false : "Image is required",
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0] || null;
                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    } else if (!isEditing) {
                      setImagePreview(null);
                    }
                  },
                })}
              />
            </label>
            {errors.image && (
              <p className="error-message">{errors.image.message}</p>
            )}

            {imagePreview && (
              <div className="preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingSpinner />
            ) : isEditing ? (
              "Update Teacher"
            ) : (
              "Add Teacher"
            )}
          </button>
        </form>
      </div>

      {deleteMutation.isPending && <LoadingSpinner />}

      <AppDataTable
        title="All Teachers"
        data={teachers}
        columns={teacherColumns}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions
      />
    </>
  );
};

export default TeachersAdmin;
