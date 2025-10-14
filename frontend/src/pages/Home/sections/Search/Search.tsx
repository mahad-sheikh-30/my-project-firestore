import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import searchIcon from "../../../../assets/search.png";
import p1 from "../../../../assets/p1.jpg";
import p2 from "../../../../assets/p2.jpg";
import p3 from "../../../../assets/p3.jpg";
import p4 from "../../../../assets/p4.jpg";
import graduation from "../../../../assets/graduation.png";
import onlineClass from "../../../../assets/online-class.png";
import userCircle from "../../../../assets/user-circle.png";
import courseSvg from "../../../../assets/course.svg";
import "./Search.css";

const benefits = [
  {
    img: graduation,
    title: "Online Degrees",
    desc: "Earn accredited degrees from the comfort of your home, opening doors to a world of possibilities.",
  },
  {
    img: onlineClass,
    title: "Short Courses",
    desc: "Enhance your skills with our concise and focused short courses, designed for quick and effective learning.",
  },
  {
    img: userCircle,
    title: "Training From Experts",
    desc: "Increase yourself knowledge with trusted experts guiding you through hands-on experien",
  },
  {
    img: courseSvg,
    title: "1.5k+ Video Courses",
    desc: "Dive into our vast library of over 1.5k video courses covering every subject area, offering a visual learning experience.",
  },
];

const Search: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm)}`);
    }
  };
  return (
    <section className="search-sec" id="course">
      <div className="search">
        <h1>Search Courses</h1>
        <div className="search-box">
          <img src={searchIcon} alt="Search" />
          <input
            type="text"
            placeholder="Search for over 50+ courses"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button className="button search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      <div className="below-search">
        <div className="search-pic">
          <div className="pics">
            <img src={p1} alt="pic1" className=" top-left" />
            <img src={p2} alt="pic2" className=" top-right" />
            <img src={p4} alt="pic3" className=" bottom-left" />
            <img src={p3} alt="pic4" className=" bottom-right" />
          </div>
        </div>
        <div className="search-benefits">
          <div className="benefits-head">
            <h1>
              <span className="benefits-title">Benefits</span> From Our Online
              <br />
              Learning
            </h1>
          </div>
          {benefits.map((b, i) => (
            <div className="benefits" key={i}>
              <img src={b.img} alt={b.title} />
              <div>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Search;
