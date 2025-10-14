import React, { useEffect, useMemo, useState } from "react";
import TeacherCard from "../../components/TeacherCard/TeacherCard";
import type { Teacher } from "../../components/TeacherCard/TeacherCard";
import "./TeacherPage.css";
import searchIcon from "../../assets/search.png";
import { getAllTeachers } from "../../api/teacherApi";
import { useQuery } from "@tanstack/react-query";
const ITEMS_PER_PAGE = 6;

const TeacherPage: React.FC = () => {
  // const [teachers, setTeachers] = useState<Teacher[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [activeOption, setActiveOption] = useState("");

  const { data: teachers = [], isLoading: teachersLoading } = useQuery({
    queryKey: ["teachers"],
    queryFn: getAllTeachers,
  });

  const loading = teachersLoading;

  // useEffect(() => {
  //   loadTeachers();
  // }, []);

  // const loadTeachers = async () => {
  //   try {
  //     const data = await getAllTeachers();
  //     setTeachers(data);
  //     setFilteredTeachers(data);
  //   } catch (err) {
  //     console.error("Error fetching teachers:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value.toLowerCase());
    setPage(1);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const filteredTeachers = useMemo(() => {
    let list = teachers;
    if (searchTerm.trim() !== "") {
      list = teachers.filter((t: Teacher) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    switch (activeOption) {
      case "ratingLow":
        list = [...list].sort((a, b) => a.rating - b.rating);
        break;
      case "ratingHigh":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return list;
  }, [teachers, searchTerm, activeOption]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedTeachers = filteredTeachers.slice(start, end);

  const totalPages = Math.ceil(filteredTeachers.length / ITEMS_PER_PAGE);

  if (loading) return <h2>Loading teachers...</h2>;

  return (
    <>
      <section className="teachers-page">
        <h1 id="title">Meet Our Instructors</h1>
        <div className="head">
          <div className="search-bar">
            <img src={searchIcon} alt="search" />
            <input
              type="text"
              placeholder="Search teachers..."
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
                  className={activeOption === "ratingLow" ? "active" : ""}
                  onClick={() => {
                    setActiveOption("ratingLow"), setIsOpen(false);
                  }}
                >
                  Rating: Low to High
                </p>
              </strong>
              <hr />
              <strong>
                <p
                  className={activeOption === "ratingHigh" ? "active" : ""}
                  onClick={() => {
                    setActiveOption("ratingHigh");
                    setIsOpen(false);
                  }}
                >
                  Rating: High to Low
                </p>
              </strong>
            </div>
          )}
        </div>
        <div className="teachers-list">
          {paginatedTeachers.length > 0 ? (
            paginatedTeachers.map((teacher: Teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))
          ) : (
            <h3>No teachers found</h3>
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
    </>
  );
};

export default TeacherPage;
