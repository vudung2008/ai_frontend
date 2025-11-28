import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import AuthRoute from './components/AuthRoute';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AuthProvider from './components/AuthProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthRoute />,
    children: [
      { path: '', element: <LandingPage /> },
      { path: 'signin', element: <SignInPage /> },
      { path: 'signup', element: <SignUpPage /> },
    ]
  },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/home', element: <HomePage /> }
    ]
  }
])

function App() {

  return <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
}

export default App
