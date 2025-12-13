import axios from 'axios';

const API_URL = 'https://sweet-shop-management-system-exg4.onrender.com';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    login: (credentials) => api.post('/api/auth/login', credentials),
    register: (userData) => api.post('/api/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const sweetService = {
    getAll: () => api.get('/api/sweets'),
    create: (sweetData) => api.post('/api/sweets', sweetData),
    update: (id, sweetData) => api.put(`/api/sweets/${id}`, sweetData),
    delete: (id) => api.delete(`/api/sweets/${id}`),
    purchase: (id) => api.post(`/api/sweets/${id}/purchase`),
    restock: (id, amount) => api.post(`/api/sweets/${id}/restock?amount=${amount}`),
};

export default api;
