/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStore } from "./useStore";
import { api, type CustomAxiosRequestConfig } from "../utils/api";
import secureStorage from "react-secure-storage";
import { AxiosError } from "axios";

export interface SignInData {
    username: string;
    password: string;
}

export interface SignUpData {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface SignInResponse {
    refreshToken: string;
    accessToken: string;
}
export const useAuth = () => {
    const { accessToken, setAccessToken, user, setUser } = useStore();

    const signin = async (data: SignInData) => {
        try {
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const res = await api.post<SignInResponse>("/auth/signin", data, { skipAuth: true } as CustomAxiosRequestConfig);
            setAccessToken(res.data.accessToken);
            if (isMobile) {
                secureStorage.setItem("refreshToken", res.data.refreshToken);
            }
            return true;
        } catch (error: any) {
            setAccessToken(null);
            if (error.response && error.response.status === 401) {
                console.error("Sign-in failed: Invalid username or password");
            }
            console.error("Sign-in failed", error);
            return false;
        }
    };

    const signup = async (data: SignUpData) => {
        try {
            await api.post("/auth/signup", data, { skipAuth: true } as CustomAxiosRequestConfig);
            return true;
        } catch (error: any) {
            if (error.response && error.response.status === 409) {
                console.error("Sign-up failed: Username or email already exists");
            }
            console.error("Sign-up failed", error);
            return false;
        }
    }

    const signout = async () => {
        try {
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const data: {
                refreshToken?: string | null;
            } = {};
            if (isMobile) {
                data.refreshToken = secureStorage.getItem("refreshToken") as string | null;
            }
            await api.post("/auth/signout", data, { skipAuth: true } as CustomAxiosRequestConfig);
            if (isMobile) {
                secureStorage.removeItem("refreshToken");
            }
            setAccessToken(null);
            setUser(null);
            return true;
        } catch (error) {
            console.error("Sign-out failed", error);
            return false;
        }
    };

    const refresh = async () => {
        try {
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const data: {
                refreshToken?: string | null;
            } = {};
            if (isMobile) {
                data.refreshToken = secureStorage.getItem("refreshToken") as string | null;
            }
            const res = await api.post("/auth/refresh", data, { skipAuth: true } as CustomAxiosRequestConfig);
            await setAccessToken(res.data.accessToken);
            return true;
        } catch (error) {
            if (error instanceof AxiosError && error.response && error.response.status === 401) {
                // Refresh token không hợp lệ hoặc hết hạn
                secureStorage.removeItem("refreshToken");
            }
            setAccessToken(null);
            console.error("Token refresh failed", error);
            return false;
        }
    }

    const isLoggedIn = !!accessToken;

    return { signin, signup, signout, isLoggedIn, user, refresh };
};
