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
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

export const sweetService = {
    getAll: () => api.get('/sweets'),
    create: (sweetData) => api.post('/sweets', sweetData),
    update: (id, sweetData) => api.put(`/sweets/${id}`, sweetData),
    delete: (id) => api.delete(`/sweets/${id}`),
    purchase: (id) => api.post(`/sweets/${id}/purchase`),
    restock: (id, amount) => api.post(`/sweets/${id}/restock?amount=${amount}`),
};

export default api;
