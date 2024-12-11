import axios from 'axios';

// Create an axios instance with the correct configuration
const api = axios.create({
    baseURL: 'https://api.adsu.shop',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Login function
export const login = async (credentials) => {
    try {
        const response = await api.post('/api/auth/login', credentials);
        return response.data;
    } catch (error) {
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