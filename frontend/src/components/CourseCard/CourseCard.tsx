import "./CourseCard.css";
import React, { useState, useEffect } from "react";
import type { Teacher } from "../TeacherCard/TeacherCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEnrollment } from "../../api/enrollmentApi";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import toast from "react-hot-toast";

export interface Course {
  id: string;
  image: string;
  category: string;
  tag: string;
  title: string;
  coursesCount: number;
  studentsCount: number;
  price: number;
  teacherId: Teacher;
  popular?: boolean;
}

const CourseCard: React.FC<{
  course: Course;
  checkout?: boolean;
  enrolledCourses?: string[];
  onEnrollSuccess?: (courseId: string) => void;
}> = ({ course, checkout = false, enrolledCourses = [], onEnrollSuccess }) => {
  const navigate = useNavigate();
  const { updateRole } = useUser();
  const queryClient = useQueryClient();

  const enrollMutation = useMutation({
    mutationFn: (courseId: string) => createEnrollment({ courseId }),
    onSuccess: async (_, courseId) => {
      queryClient.setQueryData<string[]>(["enrolled"], (old = []) => [
        ...old,
        courseId,
      ]);
      await queryClient.invalidateQueries({ queryKey: ["enrolled"] });
      updateRole("student");
      onEnrollSuccess?.(courseId);
      toast.success("Successfully Enrolled!");
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.error || "Enrollment failed. Try again."
      );
    },
  });

  const [modalOpen, setModalOpen] = useState(false);
  const isEnroll = enrolledCourses.includes(course.id);

  const handleEnroll = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isEnroll || enrollMutation.isPending) return;
    if (enrolledCourses.length >= 6) {
      toast.error("Maximum 6 courses can be enrolled.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in first!");
      navigate("/signin");
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "admin") {
      toast.error("Admin cannot enroll in a course!");
      return;
    }

    if (Number(course.price) === 0) {
      enrollMutation.mutate(course.id);
      return;
    }

    navigate("/checkout", { state: { course } });
  };

  const handleCardClick = () => {
    if (enrollMutation.isPending) return;
    setModalOpen(true);
  };

  return (
    <>
      <div className="card" onClick={handleCardClick}>
        <img src={course.image} className="main-img" />
        <div className="card-details">
          <div className="cat-tag">
            <span className="cat">{course.category}</span>
            <span className="tag">{course.tag}</span>
          </div>
          <h2 className="title">{course.title}</h2>
          <div className="meta-info">
            <span className="courses">{course.coursesCount} Lessons</span>
            <span className="students">{course.studentsCount} Students</span>
          </div>
          <div className="pri-ins">
            <h2 className="price">${course.price}</h2>

            <span className="instruct">
              {course.teacherId?.name || "Not assigned yet"}
            </span>
          </div>
          {checkout ? (
            <></>
          ) : isEnroll ? (
            <button className="enroll-btn enrolled-btn" disabled>
              Enrolled
            </button>
          ) : (
            <button
              className="enroll-btn"
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
            >
              {enrollMutation.isPending ? <LoadingSpinner /> : "Enroll"}
            </button>
          )}
        </div>
      </div>
      {modalOpen && !checkout && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={course.image} className="modal-img-fullscreen" />

            <div className="modal-details-column">
              <div className="cat-tag">
                <span className="cat">{course.category}</span>
                <span className="tag">{course.tag}</span>
              </div>
              <h2 className="title">{course.title}</h2>
              <span className="courses">{course.coursesCount} Lessons</span>
              <span className="students">{course.studentsCount} Students</span>
              <h2 className="price">${course.price}</h2>
              <span className="instruct">
                {course.teacherId?.name || "Not assigned yet"}
              </span>

              {isEnroll ? (
                <button className="enroll-btn enrolled-btn" disabled>
                  Enrolled
                </button>
              ) : (
                <button
                  className="enroll-btn"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                >
                  {enrollMutation.isPending ? <LoadingSpinner /> : "Enroll"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default CourseCard;
