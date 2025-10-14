
import API from "./axiosInstance";

export const getAllTeachers = async () => {
  const res = await API.get("/teachers");
  return res.data;
};

export const getTeacherById = async (id: string) => {
  const res = await API.get(`/teachers/${id}`);
  return res.data;
};


export const createTeacher = async (formData: FormData) => {
  const res = await API.post("/teachers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};


export const updateTeacher = async (id: string, formData: FormData) => {
  const config = formData instanceof FormData ? {} : { headers: { "Content-Type": "application/json" } };
  const res = await API.put(`/teachers/${id}`, formData, config);
  return res.data;
};

export const deleteTeacher = async (id: string) => {
  const res = await API.delete(`/teachers/${id}`);
  return res.data;
};
