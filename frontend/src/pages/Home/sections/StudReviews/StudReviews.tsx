import "./StudReviews.css";
import StudRevCard from "../../../../components/StudRevCard/StudRevCard";
import type { StudRev } from "../../../../components/StudRevCard/StudRevCard";
import boyImg from "../../../../assets/bb1.jpeg";
import boyImg2 from "../../../../assets/bb2.jpg";
import girlImg from "../../../../assets/gg1.png";

const studentReviews: StudRev[] = [
  {
    id: "1",
    image: boyImg,
    name: "Haris Butt",
    role: "Student",
    rating: 4.6,
    review:
      "Investing in courses on this e-learning platform was a game-changer for me — absolutely transformative experience.",
  },
  {
    id: "2",
    image: girlImg,
    name: "Faiza Awan",
    role: "UI/UX Designer",
    rating: 4.8,
    review:
      "Highly recommended! The personalized feedback and applications in the course have elevated my understanding.",
  },
  {
    id: "3",
    image: boyImg2,
    name: "Mahad Sheikh",
    role: "Data Analyst",
    rating: 4.9,
    review:
      "Exceptional courses. The practical insights and flexible learning structure have been instrumental in my professional growth.",
  },
];

const StudReviews = () => {
  return (
    <div className="stud-rev-section">
      <div className="stud-head">
        <h1>Student’s Testimonials</h1>
        <p>
          Hear what our students have to say about their enriching e-learning
          experience. Real stories, real growth. Discover firsthand the impact
          our courses have had on their lives. Join thousands of learners who
          transformed their careers with us.
        </p>
      </div>
      <div className="stud-rev-cards">
        {studentReviews.map((studRev) => (
          <StudRevCard key={studRev.id} studRev={studRev} />
        ))}
      </div>
    </div>
  );
};

export default StudReviews;
