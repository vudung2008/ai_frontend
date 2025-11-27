/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type SignInData, useAuth } from "../store/useAuth";

interface SignInErrors {
    username?: boolean;
    password?: boolean;
}

const SignInPage = () => {
    const { signin } = useAuth();
    const navigator = useNavigate();
    const usernameRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const [errors, setErrors] = useState<SignInErrors>({});
    const [loading, setLoading] = useState<boolean>(false);

    const validate = async (data: SignInData) => {
        const error: SignInErrors = {};

        if (!data.username || data.username.length < 6)
            error.username = true;
        if (!data.password || data.password.length < 6)
            error.password = true;

        setErrors(error);
        return Object.keys(error).length === 0;
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData: SignInData = {
            username: usernameRef.current?.value || "",
            password: passwordRef.current?.value || "",
        }
        setLoading(true);

        if (!validate(formData)) {
            return;
        }
        const isSuccess = await signin(formData);
        if (isSuccess)
            navigator('/home');
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r  p-4">
            {/* Card */}
            <form
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
                onSubmit={handleSubmit}>
                {/* Header */}
                <div
                    className='text-center'>
                    <h2 className='text-2xl font-bold mb-2'>Đăng nhập</h2>
                    <p className='text-gray-400 mb-6'>Đăng nhập tài khoản để tiếp tục</p>
                </div>
                {/* Username */}
                <div className="mb-4">
                    <label className="block mb-2 text-gray-900 font-medium">Tên người dùng</label>
                    <input
                        ref={usernameRef}
                        type="text"
                        placeholder="Nhập tên người dùng"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                            ${errors.username ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-400"}`}
                    />
                    {errors.username && (
                        <p className="text-red-500 text-sm mt-1">Tên người dùng tối thiểu 6 ký tự</p>
                    )}
                </div>
                {/* Password */}
                <div className="mb-4">
                    <label className="block mb-2 text-gray-900 font-medium">Mật khẩu</label>
                    <input
                        ref={passwordRef}
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                            ${errors.password ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-400"}`}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm mt-1">Mật khẩu phải tối thiểu 6 ký tự</p>
                    )}
                </div>
                {/* Đăng nhập */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 rounded-lg text-white transition-all duration-200
                        ${(!loading) ? "bg-purple-500 hover:opacity-90" : "bg-gray-300 cursor-not-allowed"}
                    `}>
                    {loading ? 'Đăng nhập...' : 'Đăng nhập'}
                </button>
            </form>
        </div>

    )
}

export default SignInPage