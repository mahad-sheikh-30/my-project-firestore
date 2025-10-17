import axios from "axios";
import { auth } from "../firebase";
import toast from "react-hot-toast";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user && config.headers) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      const storedToken = localStorage.getItem("token");
      if (storedToken && config.headers) {
        config.headers.Authorization = `Bearer ${storedToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        localStorage.removeItem("token");
        window.location.href = "/signin";
      } else if (status === 403) {
        toast.error("Access denied. Admins only.");
      }
    }
    return Promise.reject(error);
  }
);

export default API;
