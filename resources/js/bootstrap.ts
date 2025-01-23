import axios from 'axios';
import './echo.ts';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.withCredentials = true;
window.axios.defaults.withXSRFToken = true;

window.axios.interceptors.request.use((config) => {
    const socketId = window.Echo.socketId();

    if (socketId) {
        config.headers['X-Socket-ID'] = socketId;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});
