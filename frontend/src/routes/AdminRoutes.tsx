import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.tsx/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import AdminPanel from "../pages/Admin/AdminPanel";
import CoursesAdmin from "../pages/Admin/CoursesAdmin";
import TeachersAdmin from "../pages/Admin/TeachersAdmin";
import EnrollmentsAdmin from "../pages/Admin/EnrollmentsAdmin";
import AdminTransactions from "../pages/Admin/TransactionsAdmin";

const AdminRoutes = (
  <>
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<AdminPanel />} />
      <Route path="courses" element={<CoursesAdmin />} />
      <Route path="teachers" element={<TeachersAdmin />} />
      <Route path="enrollments" element={<EnrollmentsAdmin />} />
      <Route path="transactions" element={<AdminTransactions />} />
    </Route>
  </>
);

export default AdminRoutes;
