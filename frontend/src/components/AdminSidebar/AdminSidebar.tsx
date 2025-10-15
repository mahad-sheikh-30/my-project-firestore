import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./AdminSidebar.css";
import toast from "react-hot-toast";

const AdminSidebar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    toast.success("Signed out successfully!");
    navigate("/signin");
  };

  const handleToggle = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <button className="admin-toggle-btn" onClick={handleToggle}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </button>

      <div className={`admin-sidebar ${menuOpen ? "active" : ""}`}>
        <ul className="sidebar-links">
          <Link
            to="/admin"
            onClick={() => handleNavigate("/admin")}
            className="sidebar-title"
          >
            Admin Panel
          </Link>
          <hr />

          <li>
            <Link
              to="/admin/courses"
              onClick={() => handleNavigate("/admin/courses")}
            >
              Courses
            </Link>
          </li>
          <li>
            <Link
              to="/admin/teachers"
              onClick={() => handleNavigate("/admin/teachers")}
            >
              Teachers
            </Link>
          </li>
          <li>
            <Link
              to="/admin/enrollments"
              onClick={() => handleNavigate("/admin/enrollments")}
            >
              Enrollments
            </Link>
          </li>
          <li>
            <Link
              to="/admin/transactions"
              onClick={() => handleNavigate("/admin/transactions")}
            >
              Transactions
            </Link>
          </li>
        </ul>

        <div className="btns">
          <button onClick={() => handleNavigate("/")} className="button">
            Home Page
          </button>
          <button onClick={handleSignOut} className="button">
            Sign Out
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="admin-backdrop" onClick={handleToggle}></div>
      )}
    </>
  );
};

export default AdminSidebar;
