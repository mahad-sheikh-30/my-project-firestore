import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import "./AdminForms.css";
import {
  getAllTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../../api/teacherApi";

const TeachersAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    role: "",
    rating: 0,
    image: null as File | null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      alert("Teacher added!");
    },
    onError: () => alert("Failed to add teacher!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, form }: { id: string; form: FormData }) =>
      updateTeacher(id, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      alert("Teacher updated!");
    },
    onError: () => alert("Failed to update teacher!"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTeacher(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers"] });
      alert("Teacher deleted!");
    },
    onError: () => alert("Failed to delete teacher"),
  });

  const handleEdit = (teacher: any) => {
    setFormData(teacher);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const fileData = new FormData();
      fileData.append("name", formData.name);
      fileData.append("role", formData.role);
      fileData.append("rating", String(formData.rating));
      if (formData.image) {
        fileData.append("image", formData.image);
      }

      if (isEditing) {
        await updateMutation.mutateAsync({ id: formData.id, form: fileData });
      } else {
        await createMutation.mutateAsync(fileData);
      }

      setFormData({
        id: "",
        image: null as File | null,
        name: "",
        role: "",
        rating: 0,
      });
      setImagePreview(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error adding teacher:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <h1 className="main-h">Manage Teachers</h1>

      <div className="list">
        <h2>{isEditing ? "Update " : "Add "}Teacher</h2>
        <hr />
        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Instructor Name
              <input
                type="text"
                name="name"
                placeholder="Instructor Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Role
              <input
                type="text"
                name="role"
                placeholder="Role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Rating
              <input
                type="number"
                name="rating"
                placeholder="Rating"
                value={formData.rating || ""}
                onChange={handleChange}
                required
                min="0"
                max="5"
                step="0.1"
              />
            </label>
            <label>
              Image
              <input
                type="file"
                name="image"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  setFormData({
                    ...formData,
                    image: file,
                  });
                  if (file) {
                    setImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </label>

            {imagePreview && (
              <div className="preview">
                <img src={imagePreview} alt="Preview" />
              </div>
            )}
          </div>
          <button type="submit" disabled={submitting}>
            {submitting
              ? "Processing..."
              : isEditing
              ? "Update Teacher"
              : "Add Teacher"}
          </button>
        </form>
      </div>

      <div className="list">
        <h2>All Teachers</h2>
        <hr />
        {loading ? (
          <h2>Loading teachers...</h2>
        ) : (
          <div className="comp-list">
            {teachers.map((teacher: any) => (
              <div key={teacher.id} className="comp-card">
                <div className="info">
                  <h3>{teacher.name}</h3>
                </div>
                <div className="actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(teacher.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TeachersAdmin;
