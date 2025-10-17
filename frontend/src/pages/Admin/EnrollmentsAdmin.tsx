import React from "react";

import "./AdminForms.css";
import { useUser } from "../../context/UserContext";
import { deleteEnrollment, getAllEnrollments } from "../../api/enrollmentApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import AppDataTable from "../../components/AppDataTable/AppDataTable";

const enrollmentColumns = [
  { name: "Student", selector: (row: any) => row.user?.name, sortable: true },
  { name: "Course", selector: (row: any) => row.course?.title },
  { name: "Teacher", selector: (row: any) => row.course?.teacher },
];

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
  console.log(enrollments);

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
      <AppDataTable
        title="All Enrollments"
        data={enrollments}
        columns={enrollmentColumns}
        isLoading={isLoading}
        onDelete={handleDelete}
        actions
      />
    </>
  );
};

export default EnrollmentsAdmin;
