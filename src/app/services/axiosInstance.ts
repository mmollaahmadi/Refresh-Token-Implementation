import axios from 'axios';
import { getTokens, setTokens, clearTokens } from '../utils/auth';

type FailedRequest = {
    resolve: (token: string | null) => void;
    reject: (error: Error | null) => void;
};

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const axiosInstance = axios.create({
    baseURL: '/api',
});

axiosInstance.interceptors.request.use(config => {
    const { accessToken } = getTokens();
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(token => {
                        originalRequest.headers['Authorization'] = 'Bearer ' + token;
                        return axiosInstance(originalRequest);
                    })
                    .catch(err => {
                        return Promise.reject(err);
                    });
            }
            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { refreshToken } = getTokens();
                const { data } = await axiosInstance.post('/token/refresh', { refreshToken });
                setTokens(data.accessToken, data.refreshToken);
                processQueue(null, data.accessToken);
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error, null);
                clearTokens();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

function processQueue(error: Error | null, token: string | null) {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
}

export default axiosInstance;
