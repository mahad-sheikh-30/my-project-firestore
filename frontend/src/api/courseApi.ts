
import API from "./axiosInstance";

export const getAllCourses = async () => {
  const res = await API.get("/courses");
  return res.data;
};
export const getEnrolledCourses = async () => {
  const res = await API.get("/courses/my");
  return res.data;
};

export const getCourseById = async (id: string) => {
  const res = await API.get(`/courses/${id}`);
  return res.data;
};

export const createCourse = async (formData: FormData) => {
  const res = await API.post("/courses", formData);
  return res.data;
};

export const updateCourse = async (id: string, formData: FormData | Record<string, any>) => {
  const config = formData instanceof FormData ? {} : { headers: { "Content-Type": "application/json" } };
  const res = await API.put(`/courses/${id}`, formData, config);
  return res.data;
};

export const deleteCourse = async (id: string) => {
  const res = await API.delete(`/courses/${id}`);
  return res.data;
};
