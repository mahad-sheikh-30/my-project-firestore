import React from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./FullPageLoader.css";

const FullPageLoader: React.FC = () => {
  return (
    <div className="fullpage-loader">
      <LoadingSpinner />
    </div>
  );
};

export default FullPageLoader;
