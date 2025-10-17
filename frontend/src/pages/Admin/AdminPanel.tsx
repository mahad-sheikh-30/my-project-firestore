import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import API from "../../api/axiosInstance";
import "./AdminForms.css";
import { useUser } from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AppDataTable from "../../components/AppDataTable/AppDataTable";
const userColumns = [
  { name: "Name", selector: (row: any) => row.name, sortable: true },
  { name: "Email", selector: (row: any) => row.email },
  { name: "Role", selector: (row: any) => row.role },
];

const AdminPanel: React.FC = () => {
  const { user } = useUser();
  if (!user?.token) {
    toast.error("Please sign in first!");
    return;
  }

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await API.get("/users")).data,
  });

  return (
    <>
      <div className="admin-page">
        <h1>Admin Page</h1>
        <hr />

        <AppDataTable
          title="All Users"
          data={users.filter((u: any) => u.role !== "admin")}
          columns={userColumns}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default AdminPanel;
