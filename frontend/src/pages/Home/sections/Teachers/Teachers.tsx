import teacherImg from "../../../../assets/teacher.png";
import "./Teachers.css";
import { Link } from "react-router-dom";
const perks = [
  "Global Impact",
  "Flexible Schedule",
  "Innovative Teaching Tools",
  "Recognition And Reputation",
  "Creative Freedom",
  "Monetize Your Expertise",
  "Professional Development",
  "Networking Opportunities",
];

const Teachers = () => (
  <section className="teacher" id="teacher">
    <div className="teach-content">
      <div className="teach-up">
        <h1>
          If You Are A Certified Teacher Then
          <span className="instruct-title"> Become An Instructor</span>
        </h1>
        <p>
          Unlock the opportunity to inspire and educate by joining our team of
          instructors. If you’re a certified teacher, elevate your impact and
          share your expertise with learners worldwide.
        </p>
      </div>
      <h1>Enjoy Many Perks</h1>
      <ul className="grid-list">
        {perks.map((perk, i) => (
          <li key={i}>{perk}</li>
        ))}
      </ul>
      <Link to="/teachers" className="exp-teach button">
        Explore Teachers
      </Link>
    </div>
    <div className="teacher-pic">
      <div className="teach-div">
        <img src={teacherImg} alt="Teacher" className="teach-pic" />
      </div>
    </div>
  </section>
);

export default Teachers;
