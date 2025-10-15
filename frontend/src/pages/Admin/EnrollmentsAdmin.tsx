import React from "react";

import "./AdminForms.css";
import { useUser } from "../../context/UserContext";
import { deleteEnrollment, getAllEnrollments } from "../../api/enrollmentApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FullPageLoader from "../../components/FullPageLoader/FullPageLoader";
import toast from "react-hot-toast";

const EnrollmentsAdmin: React.FC = () => {
  const { updateRole, user } = useUser();

  if (!user?.token) {
    toast.error("Please sign in first!");
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
      toast.success("Enrollment deleted!");
    },
    onError: () => toast.error("Failed to delete enrollment!"),
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this enrollment?"))
      return;
    try {
      const res = await deleteMutation.mutateAsync(id);
      if (res.newRole) {
        updateRole(res.newRole);
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.error || "Failed to delete enrollment");
      } else {
        toast.error("Something went wrong");
      }
      console.error(error);
    }
  };

  return (
    <>
      <h1 className="main-h">Manage Enrollments</h1>
      <div className="list">
        <h2>All Enrollments</h2>
        {isLoading && <FullPageLoader />}
        <hr />
        <div className="comp-list">
          <div className="comp-list">
            {enrollments.length === 0
              ? !isLoading && <p>No enrollments found.</p>
              : enrollments.map((enroll: any) => (
                  <div key={enroll._id} className="comp-card">
                    <div className="info">
                      <p>
                        <strong>Student: </strong> {enroll.user?.name}
                      </p>
                      <p>
                        <strong>Course: </strong> {enroll.course?.title}
                      </p>
                      <p>
                        <strong>Teacher: </strong> {enroll.course?.teacher}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(enroll._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default EnrollmentsAdmin;
