import React from "react";

import girl1 from "../../assets/girl1.png";
import girl1Alt from "../../assets/girl-1.png";
import boy1 from "../../assets/p1.jpg";
import boy2 from "../../assets/p2.jpg";

import "./About.css";

const About: React.FC = () => (
  <>
    <section className="about-page">
      <div className="about-hero about-section">
        <h1>About Etech</h1>
        <p>
          Etech is a modern online learning platform dedicated to empowering
          learners and educators worldwide. Our mission is to make high-quality
          education accessible, engaging, and effective for everyone,
          everywhere.
          <br />
          <b>
            We connect passionate teachers and eager students, creating a
            vibrant, diverse, and supportive community.
          </b>
        </p>
      </div>
      <div className="about-mission about-section">
        <div>
          <h2>Our Mission</h2>
          <p>
            To transform the way people learn and teach by providing innovative
            tools, expert instructors, and a vibrant community. We believe in
            lifelong learning and strive to help you achieve your goals, whether
            you're a student, professional, or educator.
            <br />
            <b>
              We are committed to breaking barriers and making learning a
              joyful, lifelong adventure for all ages and backgrounds.
            </b>
          </p>
        </div>
      </div>
      <div className="about-values about-section">
        <h2>Our Values</h2>
        <ul>
          <li>Accessible, affordable, and flexible education for everyone</li>
          <li>
            Expert-led, practical, and up-to-date courses in a variety of fields
          </li>
          <li>
            Supportive and inclusive learning community, welcoming all genders
            and cultures
          </li>
          <li>
            Continuous innovation in teaching, technology, and student
            engagement
          </li>
          <li>
            Celebrating diversity and empowering both girls and boys to reach
            their full potential
          </li>
        </ul>
      </div>
      <div className="about-team about-section">
        <h2>Our Team</h2>
        <div className="about-team-pics">
          <img src={girl1} alt="Team Girl" className="about-img" />
          <img src={boy1} alt="Team Boy" className="about-img" />
          <img src={girl1Alt} alt="Team Girl 2" className="about-img" />
          <img src={boy2} alt="Team Boy 2" className="about-img" />
        </div>
        <div>
          <p>
            Our instructors and staff are passionate about education and
            technology. With years of experience in their fields, they are
            dedicated to helping you succeed and grow.
            <br />
            <b>
              Our team includes inspiring women and men from around the world,
              each bringing unique expertise and energy to our platform.
            </b>
          </p>
        </div>
      </div>
      <div className="about-extra about-section">
        <h2>What Makes Us Unique?</h2>
        <ul>
          <li>Interactive live classes and hands-on projects</li>
          <li>Personalized learning paths and progress tracking</li>
          <li>Mentorship from top instructors and industry leaders</li>
          <li>Global community events, webinars, and hackathons</li>
          <li>
            Opportunities for both girls and boys to become future leaders
          </li>
        </ul>
      </div>
      <div className="about-partners about-section">
        <h2>Our Partners</h2>
        <div className="about-logos">
          <img src={girl1} alt="Team Girl" className="about-img" />
          <img src={boy1} alt="Team Boy" className="about-img" />
          <img src={girl1Alt} alt="Team Girl 2" className="about-img" />
          <img src={boy2} alt="Team Boy 2" className="about-img" />
        </div>
      </div>
      <div className="about-cta about-section">
        <h2>Join Us</h2>
        <p>
          Whether you want to learn new skills, teach others, or partner with
          us, Etech is your gateway to a brighter future. Start your journey
          today!
        </p>
        <button className="about-btn ">Get Started</button>
      </div>
    </section>
  </>
);

export default About;
