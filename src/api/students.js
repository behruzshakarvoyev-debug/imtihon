import api from "./axios";

export const getStudents = (params) => api.get("/students", { params });
export const getStudent = (id) =>
  api.get(`/students/${id}`, { params: { _expand: "group", _embed: "payments" } });
export const createStudent = (data) => api.post("/students", data);
export const updateStudent = (id, data) => api.patch(`/students/${id}`, data);
export const deleteStudent = (id) => api.delete(`/students/${id}`);