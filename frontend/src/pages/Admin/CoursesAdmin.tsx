import React, { useState, useEffect } from "react";
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

const courseColumns = [
  {
    name: "Title",
    selector: (row: any) => row.title,
    sortable: true,
  },
];

const CoursesAdmin: React.FC = () => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    category: "",
    tag: "Free",
    price: 0,
    coursesCount: 0,
    studentsCount: 0,
    image: null as File | null,
    teacherId: "",
    popular: false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const queryClient = useQueryClient();

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
    onError: () => toast.error("Failed to add course!"),
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: target.checked });
    } else if (name === "price") {
      const priceValue = Number(value);
      setFormData({
        ...formData,
        price: priceValue,
        tag: priceValue <= 0 ? "Free" : "Premium",
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      const fileData = new FormData();
      fileData.append("title", formData.title);
      fileData.append("category", formData.category);
      fileData.append("tag", formData.tag);
      fileData.append("price", String(formData.price));
      fileData.append("coursesCount", String(formData.coursesCount));
      fileData.append("studentsCount", String(formData.studentsCount));
      fileData.append("teacherId", formData.teacherId);
      fileData.append("popular", String(formData.popular));

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
        title: "",
        category: "",
        tag: "Free",
        price: 0,
        coursesCount: 0,
        studentsCount: 0,
        image: null,
        teacherId: "",
        popular: false,
      });

      setImagePreview(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving course:", err);
      alert("Failed!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      ...course,
      teacherId: course.teacherId.id,
    });
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

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="form-row">
            <label>
              Title
              <input
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Category
              <input
                type="text"
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Tag
              <input type="text" name="tag" value={formData.tag} readOnly />
            </label>

            <label>
              Price
              <input
                type="number"
                name="price"
                placeholder="Price"
                required
                value={formData.price}
                onChange={handleChange}
                min="0"
              />
            </label>

            <label>
              Lessons Count
              <input
                type="number"
                name="coursesCount"
                placeholder="Lessons Count"
                value={formData.coursesCount || ""}
                onChange={handleChange}
                min="1"
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Students Count
              <input
                type="number"
                name="studentsCount"
                placeholder="Students Count"
                value={formData.studentsCount || ""}
                onChange={handleChange}
                min="0"
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

          <div className="form-row">
            <label>
              Teacher
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleChange}
                required
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher: any) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="checkbox-label">
              Popular:
              <input
                type="checkbox"
                name="popular"
                checked={formData.popular}
                onChange={handleChange}
              />
            </label>
          </div>

          <button type="submit" disabled={submitting}>
            {submitting ? (
              <LoadingSpinner />
            ) : isEditing ? (
              "Update Course"
            ) : (
              "Add Course"
            )}
          </button>
        </form>
      </div>

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
