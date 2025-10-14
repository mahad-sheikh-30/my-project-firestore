import React from "react";
import { useState, useEffect } from "react";
import API from "../../api/axiosInstance";
import "./AdminForms.css";
import { useUser } from "../../context/UserContext";
import { deleteEnrollment, getAllEnrollments } from "../../api/enrollmentApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const EnrollmentsAdmin: React.FC = () => {
  // const [enrollments, setEnrollments] = useState<any[]>([]);
  const { updateRole, user } = useUser();

  if (!user?.token) {
    alert("Please sign in first!");
    return;
  }
  const queryClient = useQueryClient();

  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ["enrollments"],
    queryFn: getAllEnrollments,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteEnrollment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      alert("Enrollment added!");
    },
    onError: () => alert("Failed to delete enrollment!"),
  });
  // useEffect(() => {
  //   fetchEnrollments();
  // }, []);
  // const fetchEnrollments = async () => {
  //   try {
  //     const res = await API.get("/enrollments");
  //     setEnrollments(res.data);
  //     console.log(res.data);
  //   } catch (err) {
  //     console.error("Error fetching courses:", err);
  //   }
  // };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;
    try {
      const res = await deleteMutation.mutateAsync(id);
      if (res.newRole) {
        updateRole(res.newRole);
      }
      // alert(res.message);
      // fetchEnrollments();
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error || "Failed to delete enrollment");
      } else {
        alert("Something went wrong");
      }
      console.error(error);
    }
  };
  if (isLoading) return <h2>Loading Enrollments...</h2>;
  return (
    <>
      <h1 className="main-h">Manage Enrollments</h1>
      <div className="list">
        <h2>All Enrollments</h2>
        <hr />
        <div className="comp-list">
          <div className="comp-list">
            {enrollments.length === 0 ? (
              <p>No enrollments found.</p>
            ) : (
              enrollments.map((enroll: any) => (
                <div key={enroll._id} className="comp-card">
                  <div className="info">
                    <p>
                      <strong>Student: </strong> {enroll.userId?.name}
                    </p>
                    <p>
                      <strong>Course: </strong> {enroll.courseId?.title}
                    </p>
                    <p>
                      <strong>Teacher: </strong>{" "}
                      {enroll.courseId?.teacherId?.name}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(enroll._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentsAdmin;
