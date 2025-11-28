import { Outlet, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const AuthRoute = () => {

    const { accessToken, isLogin } = useStore();

    if (accessToken && isLogin) {
        return <Navigate to='/home' replace />
    }

    return <Outlet />
}

export default AuthRoute
