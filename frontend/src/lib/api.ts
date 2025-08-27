import axios, { AxiosInstance, AxiosResponse } from 'axios';

/**
 * API Base URL
 */
const API_BASE_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001/api';

/**
 * Axios Instance
 */
const api: AxiosInstance = axios.create({
  baseURL: '' + API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

/**
 * Request Interceptor → Add Auth Token
 */
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor → Handle 401 Unauthorized
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

/**
 * ------- Types -------
 */
export interface AuthRegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
  address?: string;
}

export interface AuthLoginPayload {
  email: string;
  password: string;
}

export interface MenuItem {
  id?: number;
  name: string;
  price: number;
  category: string;
  description?: string;
  image_url?: string;
}

export interface Reservation {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  reservation_date: string;
  reservation_time: string;
  party_size: number;
  special_requests?: string;
  status?: string;
}

export interface OrderItem {
  menu_item_id: number;
  quantity: number;
  customizations?: Record<string, unknown>;
  special_instructions?: string;
}

export interface Order {
  id?: number;
  items: OrderItem[];
  order_type: 'dine_in' | 'takeaway' | 'delivery';
  delivery_address?: string;
  notes?: string;
  status?: string;
}

/**
 * ------- Auth API -------
 */
export const authAPI = {
  register: (data: AuthRegisterPayload): Promise<AxiosResponse> => api.post('/register', data),
  login: (data: AuthLoginPayload): Promise<AxiosResponse> => api.post('/login', data),
  logout: (): Promise<AxiosResponse> => api.post('/logout'),
  me: (): Promise<AxiosResponse> => api.get('/me'),
};

/**
 * ------- Menu API -------
 */
export const menuAPI = {
  
  getAll: (): Promise<AxiosResponse<{ menu_items: MenuItem[] }>> => api.get('/menu'),
  getById: (id: number): Promise<AxiosResponse<MenuItem>> => api.get(`/menu/${id}`),
  getByCategory: (category: string): Promise<AxiosResponse<MenuItem[]>> =>
    api.get(`/menu/category/${category}`),
  create: (data: MenuItem): Promise<AxiosResponse<MenuItem>> => api.post('/menu', data),
  update: (id: number, data: Partial<MenuItem>): Promise<AxiosResponse<MenuItem>> =>
    api.put(`/menu/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/menu/${id}`),
};

/**
 * ------- Reservation API -------
 */
export const reservationAPI = {
  getAll: (): Promise<AxiosResponse<Reservation[]>> => api.get('/reservations'),
  getById: (id: number): Promise<AxiosResponse<Reservation>> => api.get(`/reservations/${id}`),
  create: (data: Reservation): Promise<AxiosResponse<Reservation>> => api.post('/reservations', data),
  update: (id: number, data: Partial<Reservation>): Promise<AxiosResponse<Reservation>> =>
    api.put(`/reservations/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/reservations/${id}`),
  updateStatus: (id: number, status: string): Promise<AxiosResponse<Reservation>> =>
    api.put(`/reservations/${id}/status`, { status }),
  adminGetAll: (): Promise<AxiosResponse<Reservation[]>> => api.get('/admin/reservations'),
};

/**
 * ------- Order API -------
 */
export const orderAPI = {
  getAll: (): Promise<AxiosResponse<Order[]>> => api.get('/orders'),
  getById: (id: number): Promise<AxiosResponse<Order>> => api.get(`/orders/${id}`),
  create: (data: Order): Promise<AxiosResponse<Order>> => api.post('/orders', data),
  update: (id: number, data: Partial<Order>): Promise<AxiosResponse<Order>> =>
    api.put(`/orders/${id}`, data),
  delete: (id: number): Promise<AxiosResponse<void>> => api.delete(`/orders/${id}`),
  updateStatus: (id: number, status: string): Promise<AxiosResponse<Order>> =>
    api.put(`/orders/${id}/status`, { status }),
  adminGetAll: (): Promise<AxiosResponse<Order[]>> => api.get('/admin/orders'),
};

/**
 * ------- Dashboard API -------
 */
export const dashboardAPI = {
  getStats: (): Promise<AxiosResponse> => api.get('/dashboard/stats'),
  adminDashboard: (): Promise<AxiosResponse> => api.get('/admin/dashboard'),
  staffDashboard: (): Promise<AxiosResponse> => api.get('/staff/dashboard'),
  getUsers: (): Promise<AxiosResponse> => api.get('/admin/users'),
};

/**
 * ------- Blog API -------
 */
export const blogAPI = {
  async getPosts(page = 1, pageSize = 10) {
    const response = await api.get(`/blog/posts`, {
      params: { page, pageSize },
    });
    return response.data; // Expect shape: { posts: BlogPost[], total: number }
  },

  async getPostBySlug(slug: string) {
    const response = await api.get(`/blog/posts/${slug}`);
    return response.data; // Expect BlogPost object
  },
};

export default api;
