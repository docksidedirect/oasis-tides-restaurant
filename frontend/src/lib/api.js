import axios from "axios";

const API_BASE_URL = "http://localhost:8001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/login", credentials),
  register: (userData) => api.post("/register", userData),
  logout: () => api.post("/logout"),
  me: () => api.get("/user"),
  getUsers: () => api.get("/users"),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getDashboard: () => api.get("/dashboard"),
};

// Menu API
export const menuAPI = {
  getMenuItems: () => api.get("/menu"),
  getMenuItem: (id) => api.get(`/menu/${id}`),
  createMenuItem: (data) => {
    if (data instanceof FormData) {
      return api.post("/menu", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.post("/menu", data);
  },
  updateMenuItem: (id, data) => {
    if (data instanceof FormData) {
      return api.post(`/menu/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/menu/${id}`, data);
  },
  deleteMenuItem: (id) => api.delete(`/menu/${id}`),
};

// Order API
export const orderAPI = {
  getOrders: () => api.get("/orders"),
  getUserOrders: () => api.get("/orders/my-orders"),
  getOrder: (id) => api.get(`/orders/${id}`),
  createOrder: (data) => api.post("/orders", data),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

// Reservation API
export const reservationAPI = {
  getReservations: () => api.get("/reservations"),
  getReservation: (id) => api.get(`/reservations/${id}`),
  createReservation: (data) => api.post("/reservations", data),
  updateReservationStatus: (id, status) =>
    api.put(`/reservations/${id}/status`, { status }),
  deleteReservation: (id) => api.delete(`/reservations/${id}`),
};

// Blog API
export const blogAPI = {
  getBlogPosts: (params) => api.get("/blog/posts", { params }),
  getBlogPost: (slug) => api.get(`/blog/posts/${slug}`),
  createBlogPost: (data) => api.post("/blog/posts", data),
  updateBlogPost: (id, data) => api.put(`/blog/posts/${id}`, data),
  deleteBlogPost: (id) => api.delete(`/blog/posts/${id}`),
};

export default api;
