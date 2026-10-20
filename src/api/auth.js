import api from "./axios";

export const loginRequest = (username, password) =>
  api.get("/admins", { params: { username, password } });

export const getStoredAdmin = () => {
  const data = localStorage.getItem("admin");
  return data ? JSON.parse(data) : null;
};

export const saveAdmin = (admin) => {
  const safeAdmin = {
    id: admin.id,
    username: admin.username,
    fullName: admin.fullName,
    avatar: admin.avatar,
  };
  localStorage.setItem("admin", JSON.stringify(safeAdmin));
};

export const clearAdmin = () => localStorage.removeItem("admin");

export const getAdmin = (id) => api.get(`/admins/${id}`);
export const updateAdminPassword = (id, password) =>
  api.patch(`/admins/${id}`, { password });