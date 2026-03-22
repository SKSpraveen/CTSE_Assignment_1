import axios from "axios";

const BASE_URL = "https://api-gateway.salmonbeach-27f7baf6.eastus.azurecontainerapps.io";

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If token expires, redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── User Service ────────────────────────────────────────────────
export const registerUser     = (data) => api.post("/api/users/register", data);
export const loginUser        = (data) => api.post("/api/users/login", data);
export const getMyProfile     = ()     => api.get("/api/users/profile");
export const updateMyProfile  = (data) => api.put("/api/users/profile", data);
export const getMyStatus      = ()     => api.get("/api/users/status");

// ── Admin Service ───────────────────────────────────────────────
export const loginAdmin          = (data) => api.post("/api/admin/login", data);
export const getAllUsers          = ()     => api.get("/api/admin/users");
export const verifyUser          = (id)   => api.put(`/api/admin/users/${id}/verify`);
export const deactivateUser      = (id)   => api.put(`/api/admin/users/${id}/deactivate`);
export const getAllProviders      = ()     => api.get("/api/admin/providers");
export const activateProvider    = (id)   => api.put(`/api/admin/providers/${id}/activate`);
export const deactivateProvider  = (id)   => api.put(`/api/admin/providers/${id}/deactivate`);
export const deleteProvider      = (id)   => api.delete(`/api/admin/providers/${id}`);
export const getAllAppointments   = ()     => api.get("/api/admin/appointments");

// ── Appointment Service ─────────────────────────────────────────
export const getProviders        = ()     => api.get("/api/appointments/providers");
export const getAvailability     = (id)   => api.get(`/api/appointments/providers/${id}/availability`);
export const bookAppointment     = (data) => api.post("/api/appointments/book", data);
export const getMyAppointments   = ()     => api.get("/api/appointments/my");
export const cancelAppointment   = (id)   => api.put(`/api/appointments/${id}/cancel`);

// ── Service Provider Service ────────────────────────────────────
export const registerProvider    = (data) => api.post("/api/providers/register", data);
export const loginProvider       = (data) => api.post("/api/providers/login", data);
export const getProviderProfile  = ()     => api.get("/api/providers/profile");
export const updateProviderProfile = (data) => api.put("/api/providers/profile", data);
export const getNotifications    = ()     => api.get("/api/providers/notifications");
export const markNotifRead       = (id)   => api.put(`/api/providers/notifications/${id}/read`);

export default api;