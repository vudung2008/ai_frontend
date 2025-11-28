import { Outlet, Navigate } from 'react-router-dom'
import { useStore } from '../store/useStore'

const ProtectedRoute = () => {

    const { accessToken, isLogin } = useStore();

    if (!accessToken || !isLogin) {
        return <Navigate to='/signin' replace />
    }

    return <Outlet />
}

export default ProtectedRoute
