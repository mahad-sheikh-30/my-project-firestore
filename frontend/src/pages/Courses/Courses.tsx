import React, { useEffect, useMemo, useState } from "react";
import CourseCard from "../../components/CourseCard/CourseCard";
import type { Course } from "../../components/CourseCard/CourseCard";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import "./Courses.css";
import searchIcon from "../../assets/search.png";
import { useLocation } from "react-router-dom";
import { getAllCourses } from "../../api/courseApi";
import { getEnrolledCourses } from "../../api/enrollmentApi";
import { useUser } from "../../context/UserContext";

const ITEMS_PER_PAGE = 6;

const Courses: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [activeOption, setActiveOption] = useState("all");

  // const [courses, setCourses] = useState<Course[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  // const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);

  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCourses,
  });

  const { data: enrolledCourses = [], isLoading: enrolledLoading } = useQuery({
    queryKey: ["enrolled"],
    queryFn: getEnrolledCourses,
    enabled: !!user?.token,
  });

  // useEffect(() => {
  //   loadCourses();
  // }, []);

  // const loadCourses = async () => {
  //   try {
  //     const [allCourses, enrolled] = await Promise.all([
  //       getAllCourses(),
  //       getEnrolledCourses(),
  //     ]);
  //     setCourses(allCourses);
  //     setFilteredCourses(allCourses);
  //     setEnrolledCourses(enrolled);
  //     }
  //   } catch (err) {
  //     console.error("Error fetching courses:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loading = coursesLoading || enrolledLoading;

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filteredCourses = useMemo(() => {
    const search = (searchTerm || initialSearch).toLowerCase();
    let list = courses;
    if (search.trim() !== "") {
      list = courses.filter((c: Course) =>
        c.title.toLowerCase().includes(search)
      );
    }

    switch (activeOption) {
      case "priceLow":
        list = [...list].sort((a: Course, b: Course) => a.price - b.price);
        break;
      case "priceHigh":
        list = [...list].sort((a: Course, b: Course) => b.price - a.price);
        break;
      case "students":
        list = [...list].sort(
          (a: Course, b: Course) => b.studentsCount - a.studentsCount
        );
        break;
      case "lessons":
        list = [...list].sort(
          (a: Course, b: Course) => b.coursesCount - a.coursesCount
        );
        break;
      case "enrolled":
        list = list.filter((c: Course) => enrolledCourses.includes(c._id));
        break;
      case "not-enrolled":
        list = list.filter((c: Course) => !enrolledCourses.includes(c._id));
        break;
      default:
        break;
    }

    return list;
  }, [courses, searchTerm, initialSearch, activeOption, enrolledCourses]);

  const handleEnrollSuccess = (courseId: string) => {
    queryClient.setQueryData<string[]>(["enrolled"], (old = []) => [
      ...old,
      courseId,
    ]);
    queryClient.invalidateQueries({ queryKey: ["enrolled"] });
  };

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(start, end);

  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  if (loading) return <h2>Loading courses...</h2>;

  return (
    <section className="courses-page">
      <h1 id="title">All Courses</h1>
      <div className="head">
        <div className="search-bar">
          <img src={searchIcon} alt="search" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <button
          className="filter-btn"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
        {isOpen && (
          <div className="filter-opt">
            <strong>
              <p
                className={activeOption === "priceLow" ? "active" : ""}
                onClick={() => {
                  setActiveOption("priceLow");
                  setIsOpen(false);
                }}
              >
                Price: Low to High
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "priceHigh" ? "active" : ""}
                onClick={() => {
                  setActiveOption("priceHigh");
                  setIsOpen(false);
                }}
              >
                Price: High to Low
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "students" ? "active" : ""}
                onClick={() => {
                  setActiveOption("students");
                  setIsOpen(false);
                }}
              >
                Sort by Students Count
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "lessons" ? "active" : ""}
                onClick={() => {
                  setActiveOption("lessons");
                  setIsOpen(false);
                }}
              >
                Sort by Lessons Count
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "enrolled" ? "active" : ""}
                onClick={() => {
                  setActiveOption("enrolled");
                  setIsOpen(false);
                }}
              >
                Show Enrolled Courses
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "not-enrolled" ? "active" : ""}
                onClick={() => {
                  setActiveOption("not-enrolled");
                  setIsOpen(false);
                }}
              >
                Show Not Enrolled Courses
              </p>
            </strong>
            <hr />
            <strong>
              <p
                className={activeOption === "all" ? "active" : ""}
                onClick={() => {
                  setActiveOption("all");
                  setIsOpen(false);
                }}
              >
                Show All Courses
              </p>
            </strong>
          </div>
        )}
      </div>

      <div className="popular-cards">
        {paginatedCourses.length > 0 ? (
          paginatedCourses.map((course: Course) => (
            <CourseCard
              key={course._id}
              course={course}
              enrolledCourses={enrolledCourses}
              onEnrollSuccess={handleEnrollSuccess}
            />
          ))
        ) : (
          <h3>No courses found</h3>
        )}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            ← Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
};

export default Courses;
