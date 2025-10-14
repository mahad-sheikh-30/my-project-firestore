import React, { useEffect, useState } from "react";
import "./AdminPanel.css";
import API from "../../api/axiosInstance";
import "./AdminForms.css";
import { useUser } from "../../context/UserContext";
import { useQuery } from "@tanstack/react-query";
const AdminPanel: React.FC = () => {
  const { user } = useUser();
  if (!user?.token) {
    alert("Please sign in first!");
    return;
  }

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await API.get("/users")).data,
  });

  if (isLoading) return <h2>Loading users...</h2>;

  //  useEffect(() => {
  //   fetchUsers();
  // }, []);
  // const [users, setUsers] = useState<any>([]);
  // const fetchUsers = async () => {
  //   try {
  //     const res = await API.get("/users");
  //     setUsers(res.data);
  //   } catch (err) {
  //     console.error("Error fetching users:", err);
  //   }
  // };

  return (
    <>
      <div className="admin-page">
        <h1>Admin Page</h1>
      </div>

      <div className="list">
        <h2>All Users</h2>
        <div className="comp-list">
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            users.map((user: any) =>
              user.role === "admin" ? null : (
                <div key={user._id} className="comp-card">
                  <div className="info">
                    <p>
                      <strong>Name: </strong> {user.name}
                    </p>
                    <p>
                      <strong>Email: </strong> {user.email}
                    </p>
                    <p>
                      <strong>Role: </strong> {user.role}
                    </p>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AdminPanel;
