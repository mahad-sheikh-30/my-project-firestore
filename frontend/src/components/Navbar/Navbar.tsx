import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import crossImg from "../../assets/closee.png";
import userImg from "../../assets/user-circle.png";
import { useUser } from "../../context/UserContext";
import userIcon from "../../assets/user.png";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user-img") && !target.closest(".user-info")) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    navigate("/signin");
    setIsMenuOpen(false);
  };

  const name = user?.name;
  const email = user?.email;
  const role = user?.role;

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          <h1>Etech.</h1>
        </Link>

        <div className="nav-items" aria-label="Primary">
          <ul className="nav-links">
            <li>
              <Link to="/courses">Courses</Link>
            </li>
            <li>
              <Link to="/teachers">Teachers</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className="sign-trial">
          {!user ? (
            <Link to="/signin">
              <button className="sign-in-btn button">Sign In</button>
            </Link>
          ) : (
            <>
              <div
                className="user-img"
                onClick={() => setIsUserOpen(!isUserOpen)}
              >
                <img src={userIcon} alt="" />

                {isUserOpen && (
                  <div className="user-info">
                    <h4>{name?.toUpperCase()}</h4>
                    <hr />
                    <p>{email}</p>
                    <hr />
                    <h4>{role?.toUpperCase()}</h4>
                    <hr />

                    {role === "admin" && (
                      <>
                        <button
                          onClick={() => {
                            navigate("/admin");
                            setIsUserOpen(false);
                          }}
                          className="button"
                        >
                          Admin Panel
                        </button>
                        <hr />
                      </>
                    )}
                    {role === "student" && (
                      <>
                        <Link to="/transactions">My Transactions</Link>
                        <hr />
                      </>
                    )}
                    <button onClick={handleSignOut} className=" button">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>
      </nav>
      <div
        className={`mobile-menu ${isMenuOpen ? "open" : ""}`}
        id="mobileMenu"
      >
        <div className="mobile-header">
          <Link
            to="/"
            className="logo mobile-logo"
            onClick={() => setIsMenuOpen(false)}
          >
            <h1>Etech.</h1>
          </Link>

          <button
            className="close-icon"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close menu"
          >
            <img src={crossImg} alt="close" />
          </button>
        </div>
        <hr />

        <ul>
          <li>
            <Link to="/courses" onClick={() => setIsMenuOpen(false)}>
              Courses
            </Link>
          </li>
          <li>
            <Link to="/teachers" onClick={() => setIsMenuOpen(false)}>
              Teachers
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)}>
              Contact
            </Link>
          </li>
        </ul>
        {user ? (
          <div className="mobile-user-card">
            <div className="mobile-user-header">
              <h3>{name?.toUpperCase()}</h3>
              <p>{email}</p>
              <span className="user-role">{role?.toUpperCase()}</span>
            </div>

            <div className="mobile-user-actions">
              {role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setIsMenuOpen(false);
                  }}
                  className="button admin-btn"
                >
                  Admin Panel
                </button>
              )}
              {role === "student" && (
                <Link
                  to="/transactions"
                  onClick={() => setIsMenuOpen(false)}
                  className="button"
                >
                  My Transactions
                </Link>
              )}
            </div>
          </div>
        ) : (
          <></>
        )}

        <div className="mobile-buttons">
          {!user ? (
            <Link to="/signin" onClick={() => setIsMenuOpen(false)}>
              <button className="sign-in-btn button">Sign In</button>
            </Link>
          ) : (
            <button onClick={handleSignOut} className="sign-in-btn button">
              Sign Out
            </button>
          )}

          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <button className="home-btn button">Go Back Home</button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
