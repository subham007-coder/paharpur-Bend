export const setAuthToken = (token) => {
    if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
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