import React, { useEffect, useState } from "react";
import CourseCard from "../../../../components/CourseCard/CourseCard";
import type { Course } from "../../../../components/CourseCard/CourseCard";
import "./Popular.css";
import { getAllCourses } from "../../../../api/courseApi";
import { getEnrolledCourses } from "../../../../api/enrollmentApi";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "../../../../context/UserContext";

const Popular: React.FC = () => {
  const { user } = useUser();
  const { data: allCourses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });
  const { data: enrolledCourses = [] } = useQuery({
    queryKey: ["enrolled"],
    queryFn: getEnrolledCourses,
    enabled: !!user?.token,
  });

  const popularCourses = allCourses.filter((course: Course) => course.popular);

  return (
    <section className="popular" id="offers">
      <div className="popular-head">
        <h1>Our Popular Courses</h1>
        <p>
          Discover our most sought-after courses, carefully curated to meet the
          demands of modern learners. Dive into engaging lessons crafted for
          success in every stage of your educational journey.
        </p>
      </div>
      {isLoading ? (
        <h2>Loading popular courses...</h2>
      ) : (
        <div className="popular-cards">
          {popularCourses.map((course: Course) => (
            <CourseCard
              key={course._id}
              course={course}
              enrolledCourses={enrolledCourses}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default Popular;
