import { useState, type ReactNode } from "react";
import { StoreContext } from "./StoreContext";
import type { User } from "../types/User";
import { setAccessTokenGlobal } from "./globalStore";

export interface StoreState {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    user: User | null;
    setUser: (user: User | null) => void;
}

export const StoreProvider = ({ children }: { children: ReactNode }) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [user, setUser] = useState<User | null>(null);

    // đồng bộ state với globalStore
    const setAccessTokenSync = (token: string | null) => {
        setAccessToken(token);
        setAccessTokenGlobal(token); // cập nhật biến global
    };

    return (
        <StoreContext.Provider value={{ accessToken, setAccessToken: setAccessTokenSync, user, setUser }}>
            {children}
        </StoreContext.Provider>
    );
};
