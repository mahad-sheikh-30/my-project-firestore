import React, { useState, useEffect } from "react";
import "./Hero.css";
import axios from "axios";
import badge from "../../../../assets/badge.png";
import girl1 from "../../../../assets/girl-1.png";
import courseSvg from "../../../../assets/course.svg";
import userCircle from "../../../../assets/user-circle.png";
import magicleap from "../../../../assets/magicleap.png";
import microsoft from "../../../../assets/microsoft.png";
import codecov from "../../../../assets/codecov.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <>
      <section className="hero-sec">
        <div className="hero">
          <div className="hero-left">
            <h1 className="hero-title">
              Develop your skills in a new and unique way
            </h1>
            <p className="hero-p">
              Explore a transformative approach to skill development on our
              online learning platform. Discover engaging lessons and elevate
              your expertise.
            </p>
            <div className="hero-btns">
              <Link to="/courses">
                <button className="enroll-btn">Explore Now</button>
              </Link>
              <div className="what-new">
                <img src={badge} alt="Badge" />
                <Link to="/about">What's New?</Link>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="circle"></div>
            <img className="girl1-img" src={girl1} alt="Girl" />
            <div className="info-box box1">
              <img src={courseSvg} alt="Course" />
              <p>
                <span className="count">50+ </span> <br />
                Online Courses
              </p>
            </div>
            <div className="info-box box2">
              <p>
                <span className="count">30K+ </span> <br />
                Online Students
              </p>
              <div className="box2-icons">
                <img src={userCircle} alt="User" />
                <img src={userCircle} alt="User" />
                <img src={userCircle} alt="User" />
                <img src={userCircle} alt="User" />
              </div>
            </div>
            <div className="info-box box3">
              <img src={userCircle} alt="User" />
              <div>
                <h3>Asad Ali</h3>
                <p>Top Instructor</p>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-bottom">
          <div className="scroll-container">
            <div className="scroll-content">
              <div className="duolingo">
                <p className="duolingo">duolingo</p>
              </div>
              <div className="magic-leap flexx">
                <img src={magicleap} alt="Magic Leap" />
                <p>magic leap</p>
              </div>
              <div className="microsoft flexx">
                <img src={microsoft} alt="Microsoft" />
                <p>Microsoft</p>
              </div>
              <div className="codecov flexx">
                <img src={codecov} alt="Codecov" />
                <p>Codecov</p>
              </div>
              <div className="user-testing">
                <p>
                  <span className="user">User</span>Testing
                </p>
              </div>
              {/* duplicate content for seamless loop */}
              <div className="duolingo">
                <p className="duolingo">duolingo</p>
              </div>
              <div className="magic-leap flexx">
                <img src={magicleap} alt="Magic Leap" />
                <p>magic leap</p>
              </div>
              <div className="microsoft flexx">
                <img src={microsoft} alt="Microsoft" />
                <p>Microsoft</p>
              </div>
              <div className="codecov flexx">
                <img src={codecov} alt="Codecov" />
                <p>Codecov</p>
              </div>
              <div className="user-testing">
                <p>
                  <span className="user">User</span>Testing
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="hero-bottom">
          <div className="duolingo">
            <p className="duolingo">duolingo</p>
          </div>
          <div className="magic-leap flexx">
            <img src={magicleap} alt="Magic Leap" />
            <p>magic leap</p>
          </div>
          <div className="microsoft flexx">
            <img src={microsoft} alt="Microsoft" />
            <p>Microsoft</p>
          </div>
          <div className="codecov flexx">
            <img src={codecov} alt="Codecov" />
            <p>Codecov</p>
          </div>
          <div className="user-testing">
            <p>
              <span className="user">User</span>Testing
            </p>
          </div>
        </div> */}
      </section>
    </>
  );
};

export default Hero;
