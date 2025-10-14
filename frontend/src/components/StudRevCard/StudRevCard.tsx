import React from "react";
import "./StudRevCard.css";
export interface StudRev {
  id: string;
  image: string;
  name: string;
  role: string;
  review: string;
  rating: number;
}

const StudRevCard: React.FC<{ studRev: StudRev }> = ({ studRev }) => {
  return (
    <>
      <article className="stud-rev-card">
        <div className="st-details">
          <img src={studRev.image} alt="" className="st-img" />
          <div className="st-rev">
            <h3>{studRev.name}</h3>
            <small>{studRev.role}</small>
            <span>⭐ {studRev.rating.toFixed(1)}</span>
          </div>
        </div>
        <p>{studRev.review}</p>
      </article>
    </>
  );
};

export default StudRevCard;
