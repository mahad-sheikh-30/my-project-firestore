import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/AdminSidebar/AdminSidebar";

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
