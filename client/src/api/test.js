// import axios from "axios";

// // If you provide a gateway URL, all calls will go through it.
// // Otherwise, calls go directly to each service (useful for local dev without Docker).
// const GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

// const USER_SERVICE_URL = GATEWAY_URL || import.meta.env.VITE_USER_SERVICE_URL || "http://localhost:3001";
// const ADMIN_SERVICE_URL = GATEWAY_URL || import.meta.env.VITE_ADMIN_SERVICE_URL || "http://localhost:3002";
// const APPOINTMENT_SERVICE_URL =
//   GATEWAY_URL || import.meta.env.VITE_APPOINTMENT_SERVICE_URL || "http://localhost:3003";
// const PROVIDER_SERVICE_URL = GATEWAY_URL || import.meta.env.VITE_PROVIDER_SERVICE_URL || "http://localhost:3004";

// const makeApiClient = (baseURL) => {
//   const instance = axios.create({ baseURL });

//   // Attach JWT token to every request automatically
//   instance.interceptors.request.use((config) => {
//     const token = localStorage.getItem("token");
//     if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   });

//   // If token expires, redirect to login
//   instance.interceptors.response.use(
//     (res) => res,
//     (err) => {
//       if (err.response?.status === 401) {
//         localStorage.clear();
//         window.location.href = "/login";
//       }
//       return Promise.reject(err);
//     }
//   );

//   return instance;
// };

// const userApi = makeApiClient(USER_SERVICE_URL);
// const adminApi = makeApiClient(ADMIN_SERVICE_URL);
// const appointmentApi = makeApiClient(APPOINTMENT_SERVICE_URL);
// const providerApi = makeApiClient(PROVIDER_SERVICE_URL);

// // Backwards compatible default export (primarily useful when using a gateway).
// const api = makeApiClient(GATEWAY_URL || USER_SERVICE_URL);

// // ── User Service ────────────────────────────────────────────────
// export const registerUser     = (data) => userApi.post("/api/users/register", data);
// export const loginUser        = (data) => userApi.post("/api/users/login", data);
// export const getMyProfile     = ()     => userApi.get("/api/users/profile");
// export const updateMyProfile  = (data) => userApi.put("/api/users/profile", data);
// export const getMyStatus      = ()     => userApi.get("/api/users/status");

// // ── Admin Service ───────────────────────────────────────────────
// export const loginAdmin          = (data) => adminApi.post("/api/admin/login", data);
// export const getAllUsers          = ()     => adminApi.get("/api/admin/users");
// export const verifyUser          = (id)   => adminApi.put(`/api/admin/users/${id}/verify`);
// export const deactivateUser      = (id)   => adminApi.put(`/api/admin/users/${id}/deactivate`);
// export const getAllProviders      = ()     => adminApi.get("/api/admin/providers");
// export const activateProvider    = (id)   => adminApi.put(`/api/admin/providers/${id}/activate`);
// export const deactivateProvider  = (id)   => adminApi.put(`/api/admin/providers/${id}/deactivate`);
// export const deleteProvider      = (id)   => adminApi.delete(`/api/admin/providers/${id}`);
// export const getAllAppointments   = ()     => appointmentApi.get("/api/appointments/all");

// // ── Appointment Service ─────────────────────────────────────────
// export const getProviders        = ()     => appointmentApi.get("/api/appointments/providers");
// export const getAvailability     = (id)   => appointmentApi.get(`/api/appointments/providers/${id}/availability`);
// export const bookAppointment     = (data) => appointmentApi.post("/api/appointments/book", data);
// export const getMyAppointments   = ()     => appointmentApi.get("/api/appointments/my");
// export const cancelAppointment   = (id)   => appointmentApi.put(`/api/appointments/${id}/cancel`);

// // ── Service Provider Service ────────────────────────────────────
// export const registerProvider    = (data) => providerApi.post("/api/providers/register", data);
// export const loginProvider       = (data) => providerApi.post("/api/providers/login", data);
// export const getProviderProfile  = ()     => providerApi.get("/api/providers/profile");
// export const updateProviderProfile = (data) => providerApi.put("/api/providers/profile", data);
// export const getNotifications    = ()     => providerApi.get("/api/providers/notifications");
// export const markNotifRead       = (id)   => providerApi.put(`/api/providers/notifications/${id}/read`);

// export default api;