import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./AdminForms.css";

import { getAllTeachers } from "../../api/teacherApi";
import {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../api/courseApi";

import toast from "react-hot-toast";
import AppDataTable from "../../components/AppDataTable/AppDataTable";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";

interface CourseFormInputs {
  id?: string;
  title: string;
  category: string;
  tag: string;
  price: number;
  coursesCount: number;
  studentsCount: number;
  image: FileList;
  teacherId: string;
  popular: boolean;
}

const courseColumns = [
  {
    name: "Title",
    selector: (row: any) => row.title,
    sortable: true,
  },
  {
    name: "Teacher",
    selector: (row: any) => row.teacherId?.name || "N/A",
    sortable: true,
  },
];

const CoursesAdmin: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CourseFormInputs>({
    defaultValues: {
      title: "",
      category: "",
      tag: "Free",
      price: 0,
      coursesCount: 0,
      studentsCount: 0,
      teacherId: "",
      popular: false,
    },
  });

  const [isEditing, setIsEditing] = useState(false);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const watchedPrice = watch("price");

  useEffect(() => {
    if (watchedPrice > 0) {
      setValue("tag", "Premium", { shouldDirty: true });
    } else {
      setValue("tag", "Free", { shouldDirty: true });
    }
  }, [watchedPrice, setValue]);

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });
  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
  });

  const loading = coursesLoading || teachersLoading;

  const createMutation = useMutation({
    mutationFn: (form: FormData) => createCourse(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course added!");
    },
    onError: () => toast.error("Failed to add Course!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updateCourse(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course updated!");
    },
    onError: () => toast.error("Failed to update course!"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCourse(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      toast.success("Course deleted!");
    },
    onError: () => toast.error("Failed to delete course!"),
  });

  const onSubmit = async (data: CourseFormInputs) => {
    if (isSubmitting) return;
    try {
      const fileData = new FormData();
      fileData.append("title", data.title);
      fileData.append("category", data.category);
      fileData.append("tag", data.tag);
      fileData.append("price", String(data.price));
      fileData.append("coursesCount", String(data.coursesCount));
      fileData.append("studentsCount", String(data.studentsCount));
      fileData.append("teacherId", data.teacherId);
      fileData.append("popular", String(data.popular));

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
      console.error("Error saving course:", err);
    }
  };

  const handleEdit = (course: any) => {
    setValue("id", course.id);
    setValue("title", course.title);
    setValue("category", course.category);
    setValue("tag", course.tag);
    setValue("price", course.price);
    setValue("coursesCount", course.coursesCount);
    setValue("studentsCount", course.studentsCount);
    setValue("teacherId", course.teacherId.id);
    setValue("popular", course.popular);
    setImagePreview(course.image || null);
    setIsEditing(true);
    window.scrollTo({ top: 70, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Error deleting course:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="course-admin">
      <h1 className="main-h">Manage Courses</h1>

      <div className="list">
        <h2>{isEditing ? "Edit Course" : "Add Course"}</h2>
        <hr />

        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
          <div className="form-row">
            <label>
              Title
              <input
                type="text"
                placeholder="Course Title"
                {...register("title", { required: "Title is required" })}
              />
            </label>
            {errors.title && (
              <p className="error-message">{errors.title.message}</p>
            )}

            <label>
              Category
              <input
                type="text"
                placeholder="Category"
                {...register("category", { required: "Category is required" })}
              />
            </label>
            {errors.category && (
              <p className="error-message">{errors.category.message}</p>
            )}
          </div>

          <div className="form-row">
            <label>
              Tag
              <input
                type="text"
                placeholder="Tag"
                {...register("tag")}
                readOnly
              />
              {errors.tag && (
                <p className="error-message">{errors.tag.message}</p>
              )}
            </label>

            <label>
              Price
              <input
                type="number"
                placeholder="Price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Min price is 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.price && (
                <p className="error-message">{errors.price.message}</p>
              )}
            </label>
          </div>

          <div className="form-row">
            <label>
              Lessons Count
              <input
                type="number"
                placeholder="Lessons Count"
                {...register("coursesCount", {
                  required: "Courses Count is required",
                  min: { value: 1, message: "Min lessons count is 1" },
                  valueAsNumber: true,
                })}
              />
              {errors.coursesCount && (
                <p className="error-message">{errors.coursesCount.message}</p>
              )}
            </label>

            <label>
              Students Count
              <input
                type="number"
                placeholder="Students Count"
                {...register("studentsCount", {
                  required: "Students Count is required",
                  min: { value: 0, message: "Min students count is 0" },
                  valueAsNumber: true,
                })}
              />
              {errors.studentsCount && (
                <p className="error-message">{errors.studentsCount.message}</p>
              )}
            </label>
          </div>
          <div className="form-row">
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
              {errors.image && (
                <p className="error-message">{errors.image.message}</p>
              )}
            </label>
            {imagePreview && (
              <div className="preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-row">
            <label>
              Teacher
              <select
                {...register("teacherId", { required: "Teacher is required" })}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
              {errors.teacherId && (
                <p className="error-message">{errors.teacherId.message}</p>
              )}
            </label>

            <label className="checkbox-label">
              Popular:
              <input type="checkbox" {...register("popular")} />
            </label>
          </div>

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <LoadingSpinner />
            ) : isEditing ? (
              "Update Course"
            ) : (
              "Add Course"
            )}
          </button>
        </form>
      </div>

      {deleteMutation.isPending && <LoadingSpinner />}
      <AppDataTable
        title="All Courses"
        data={courses}
        columns={courseColumns}
        isLoading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        actions
      />
    </div>
  );
};

export default CoursesAdmin;
