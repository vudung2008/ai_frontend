// store/globalStore.ts
let currentAccessToken: string | null = null;

export const setAccessTokenGlobal = (token: string | null) => {
    currentAccessToken = token;
};

export const getAccessTokenGlobal = () => currentAccessToken;
