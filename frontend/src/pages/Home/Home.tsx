import React from "react";
import "./Home.css";

import Hero from "./sections/Hero/Hero";
import Search from "./sections/Search/Search";
import Popular from "./sections/Popular/Popular";
import Teachers from "./sections/Teachers/Teachers";
import StudReviews from "./sections/StudReviews/StudReviews";
const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <Search />
      <Popular />
      <Teachers />
      <StudReviews />
    </div>
  );
};

export default Home;
