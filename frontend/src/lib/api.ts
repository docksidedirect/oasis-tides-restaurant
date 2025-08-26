import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ------------------------------
// TypeScript interfaces
// ------------------------------

interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface MenuItemData {
  name: string;
  description?: string;
  price: number;
  category?: string;
  image_url?: string;
  is_available?: boolean;
  is_featured?: boolean;
}

interface ReservationCreateData {
  name: string;
  phone: string;
  email?: string;
  reservation_date: string; // YYYY-MM-DD
  reservation_time: string; // HH:mm
  party_size: number;
  special_requests?: string;
}

interface ReservationUpdateData {
  name?: string;
  phone?: string;
  email?: string;
  reservation_date?: string;
  reservation_time?: string;
  party_size?: number;
  special_requests?: string;
  status?: string;
}

interface OrderItemData {
  menu_item_id: number;
  quantity: number;
  customizations?: unknown; // Define more exactly if known
  special_instructions?: string;
}

interface OrderCreateData {
  items: OrderItemData[];
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  delivery_address?: string;
  notes?: string;
}

interface OrderUpdateData {
  status?: string;
  delivery_address?: string;
  notes?: string;
  // Add other fields as needed
}

// ------------------------------
// API function groups
// ------------------------------

export const authAPI = {
  register: (data: RegisterData) => api.post('/register', data),

  login: (data: LoginData) => api.post('/login', data),

  logout: () => api.post('/logout'),

  me: () => api.get('/me'),
};

export const menuAPI = {
  getAll: () => api.get('/menu'),
  getById: (id: number) => api.get(`/menu/${id}`),
  getByCategory: (category: string) => api.get(`/menu/category/${category}`),
  create: (data: MenuItemData) => api.post('/menu', data),
  update: (id: number, data: MenuItemData) => api.put(`/menu/${id}`, data),
  delete: (id: number) => api.delete(`/menu/${id}`),
};

export const reservationAPI = {
  getAll: () => api.get('/reservations'),
  getById: (id: number) => api.get(`/reservations/${id}`),
  create: (data: ReservationCreateData) => api.post('/reservations', data),
  update: (id: number, data: ReservationUpdateData) => api.put(`/reservations/${id}`, data),
  delete: (id: number) => api.delete(`/reservations/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/reservations/${id}/status`, { status }),
  adminGetAll: () => api.get('/admin/reservations'),
};

export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: number) => api.get(`/orders/${id}`),
  create: (data: OrderCreateData) => api.post('/orders', data),
  update: (id: number, data: OrderUpdateData) => api.put(`/orders/${id}`, data),
  delete: (id: number) => api.delete(`/orders/${id}`),
  updateStatus: (id: number, status: string) => api.put(`/orders/${id}/status`, { status }),
  adminGetAll: () => api.get('/admin/orders'),
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  adminDashboard: () => api.get('/admin/dashboard'),
  staffDashboard: () => api.get('/staff/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

export default api;
