import "./PageNotFound.css";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="page-not-found">
      <div className="content">
        <h1 className="error-code">404</h1>
        <h2 className="error-text">Oops! Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
