import { useEffect, useState, type ReactNode } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { useAuth } from '../store/useAuth';
import { useStore } from '../store/useStore';

const AuthProvider = ({ children }: { children: ReactNode }) => {

    const { refresh } = useAuth();
    const { setIsLogin, accessToken } = useStore();
    const [starting, setStarting] = useState<boolean>(true);

    const init = async () => {
        try {
            // Nếu chưa có token, thử refresh
            if (!accessToken) {
                const isLogin = await refresh();
                if (isLogin) setIsLogin(true);
                else setIsLogin(false);
            }

            if (accessToken) {
                console.log('login success!')
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            console.log("Chưa đăng nhập");
        } finally {
            setStarting(false);
        }
    }

    useEffect(() => {

        // console.log(secureLocalStorage.getItem("refreshToken"))
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);
        if (!secureLocalStorage.getItem("refreshToken") && isMobile) {
            setStarting(false);
            return;
        }
        init();
    }, []);

    if (starting) {
        return <div className="flex h-screen items-center justify-center">
            Đang kiểm tra đăng nhập...
        </div>
    }

    return children;
}

export default AuthProvider
