/* eslint-disable @typescript-eslint/no-explicit-any */
import { useStore } from "./useStore";
import { api, type CustomAxiosRequestConfig } from "../utils/api";
import secureStorage from "react-secure-storage";

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
            await api.post("/auth/signout", null, { skipAuth: true } as CustomAxiosRequestConfig);
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
            const res = await api.post("/auth/refresh", null, { skipAuth: true } as CustomAxiosRequestConfig);
            setAccessToken(res.data.accessToken);
            return true;
        } catch (error) {
            setAccessToken(null);
            console.error("Token refresh failed", error);
            return false;
        }
    }

    const isLoggedIn = !!accessToken;

    return { signin, signup, signout, isLoggedIn, user, refresh };
};
