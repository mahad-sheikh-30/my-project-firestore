import React from "react";
import "./TeacherCard.css";

export interface Teacher {
  id: string;
  image: string;
  name: string;
  role: string;
  rating: number;
}

const TeacherCard: React.FC<{ teacher: Teacher }> = ({ teacher }) => (
  <div className="teacher-card">
    <img src={teacher.image} alt={teacher.name} className="teacher-img" />
    <div className="teacher-details">
      <span className="teacher-rating">⭐ {teacher.rating.toFixed(1)}</span>
      <h2 className="teacher-name">{teacher.name}</h2>
      <p className="teacher-role">{teacher.role}</p>
    </div>
  </div>
);

export default TeacherCard;
