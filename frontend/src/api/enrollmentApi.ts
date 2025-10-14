import API from "./axiosInstance";

export const getAllEnrollments = async () => {
  const res = await API.get("/enrollments");
  return res.data;
};
export const getEnrolledCourses = async () => {
  const res = await API.get("/enrollments/my");
  return res.data;
};

export const createEnrollment = async (data:any) => {
  const res = await API.post("/enrollments", data);
  return res.data;
};

export const deleteEnrollment = async (id: string) => {
  const res = await API.delete(`/enrollments/${id}`);
  return res.data;
};
