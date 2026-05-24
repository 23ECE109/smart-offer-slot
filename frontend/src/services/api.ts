import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(err);
  }
);

// Auth
export const login = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const register = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

// Business
export const getBusinesses = () => api.get('/business');
export const getBusiness = (id: number) => api.get(`/business/${id}`);
export const createBusiness = (data: object) => api.post('/business', data);
export const updateBusiness = (id: number, data: object) => api.put(`/business/${id}`, data);

// Offers
export const getOffers = (params?: object) => api.get('/offers', { params });
export const getOffer = (id: number) => api.get(`/offers/${id}`);
export const createOffer = (data: object) => api.post('/offers', data);
export const updateOffer = (id: number, data: object) => api.put(`/offers/${id}`, data);
export const deleteOffer = (id: number) => api.delete(`/offers/${id}`);

// Slots
export const getSlots = (params?: object) => api.get('/slots', { params });
export const getOfferSlots = (offerId: number) => api.get(`/offers/${offerId}/slots`);
export const createSlot = (data: object) => api.post('/slots', data);
export const updateSlot = (id: number, data: object) => api.put(`/slots/${id}`, data);
export const deleteSlot = (id: number) => api.delete(`/slots/${id}`);

// Bookings
export const getBookings = (params?: object) => api.get('/bookings', { params });
export const getBooking = (id: number) => api.get(`/bookings/${id}`);
export const getBookingByRef = (ref: string) => api.get(`/bookings/ref/${ref}`);
export const createBooking = (data: object) => api.post('/bookings', data);
export const updateBookingStatus = (id: number, status: string) =>
  api.put(`/bookings/${id}/status`, { status });

// Dashboard
export const getDashboardSummary = () => api.get('/dashboard/summary');

export default api;
