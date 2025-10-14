import { Link, useSearchParams } from "react-router-dom";
export default function Success() {
  const [params] = useSearchParams();
  const courseId = params.get("courseId");

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      {courseId ? (
        <>
          <h1>Payment Successful!</h1>
          <p>You are now successfully enrolled in course :{courseId}</p>
          <Link to="/courses">Go back to Courses</Link>
        </>
      ) : (
        <h1>404. Page not found</h1>
      )}
    </div>
  );
}
