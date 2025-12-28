import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', config.method?.toUpperCase(), config.url, config.baseURL);
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.message, error.config?.url);
        console.error('Full error object:', error);
        console.error('Error config:', error.config);
        console.error('Error response:', error.response);
        
        if (error.code === 'ERR_NETWORK') {
            console.error('Network error details:', {
                baseURL: error.config?.baseURL,
                url: error.config?.url,
                method: error.config?.method,
                message: error.message,
                code: error.code,
                errno: error.errno,
                syscall: error.syscall
            });
        }
        return Promise.reject(error);
    }
);

export default api;
