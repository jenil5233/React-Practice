import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001', // Your backend base URL
});

// Request interceptor to add the JWT token to every request
axiosInstance.interceptors.request.use(
    config => {
        // Retrieve the token from localstorage
        const token = localStorage.getItem('token');

        // If token exists, add it to the request headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        // Handle token expiration or other errors here
        if (error.response && error.response.status === 401) {
            // Token is no longer valid
            localStorage.removeItem('token');
            sessionStorage.removeItem('user');
            // Optionally redirect to login page
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
