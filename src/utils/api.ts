import axios, { type AxiosRequestConfig } from "axios";
import secureStorage from "react-secure-storage";
import { getAccessTokenGlobal, setAccessTokenGlobal } from "../store/globalStore";

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    skipAuth?: boolean;
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
});

// Hàm refresh access token riêng
export const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const refreshToken = secureStorage.getItem("refreshToken") as string | null;
        if (!refreshToken) return null;

        const res = await api.post("/auth/refresh", null, {
            headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = res.data.accessToken;
        setAccessTokenGlobal(newAccessToken);
        return newAccessToken;
    } catch (err) {
        console.error("Refresh token failed", err);
        setAccessTokenGlobal(null);
        secureStorage.removeItem("refreshToken");
        return null;
    }
};

// Request interceptor
api.interceptors.request.use((config) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    config.headers = config.headers ?? {};

    if (!config.url?.startsWith("/auth")) {
        const accessToken = getAccessTokenGlobal();
        if (accessToken) {
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${accessToken}`;
        }
    } else if (isMobile) {
        const refreshToken = secureStorage.getItem("refreshToken") as string | null;
        if (refreshToken) {
            (config.headers as Record<string, string>)["Authorization"] = `Bearer ${refreshToken}`;
        }
    }

    return config;
}, (error) => Promise.reject(error));

// Response interceptor
api.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config as CustomAxiosRequestConfig & { _retry?: boolean };
        // Nếu request này không cần auth, bỏ qua
        if (originalRequest.skipAuth) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const newAccessToken = await refreshAccessToken();
            if (newAccessToken) {
                originalRequest.headers!['Authorization'] = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } else {
                window.location.href = '/signin';
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
