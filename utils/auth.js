import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true,
});

// Remove any custom headers that might interfere with the request
api.interceptors.request.use((config) => {
    config.headers = {
        'Content-Type': 'application/json',
    };
    return config;
});

export const login = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
    }
};

export const getAuthToken = () => {
    return localStorage.getItem('token');
};

export const isAuthenticated = () => {
    return !!getAuthToken();
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Additional cleanup if needed
}; 