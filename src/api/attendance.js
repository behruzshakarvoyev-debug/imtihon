import api from "./axios";

export const getAttendance = (params) => api.get("/attendance", { params });
export const createAttendance = (data) => api.post("/attendance", data);
export const updateAttendance = (id, data) => api.patch(`/attendance/${id}`, data);