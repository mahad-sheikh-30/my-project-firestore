import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user } = useUser();
  const token = user?.token;
  const role = user?.role;

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  if (!allowedRoles.includes(role || "")) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
