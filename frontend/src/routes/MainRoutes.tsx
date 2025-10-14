import { Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Courses from "../pages/Courses/Courses";
import TeacherPage from "../pages/TeacherPage/TeacherPage";
import About from "../pages/About/About";
import Contact from "../pages/Contact/Contact";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";
import Transactions from "../pages/Transactions/Transactions";
import PaymentPage from "../pages/Payment/Payment";
import Success from "../pages/Success/Success";

const MainRoutes = (
  <>
    <Route element={<MainLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/teachers" element={<TeacherPage />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/transactions" element={<Transactions />} />
      <Route path="/checkout" element={<PaymentPage />} />
      <Route path="/success" element={<Success />} />
    </Route>
  </>
);

export default MainRoutes;
