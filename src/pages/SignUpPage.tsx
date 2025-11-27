/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import { type SignUpData, useAuth } from "../store/useAuth";

interface SignUpErrors {
    username?: boolean;
    password?: boolean;
    firstName?: boolean;
    lastName?: boolean;
    email?: boolean;
}

const SignUpPage = () => {
    const { signup } = useAuth();
    const navigator = useNavigate();
    const [accept, setAccept] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<SignUpErrors>({});

    // Refs
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    // Validate
    const validate = (data: SignUpData) => {
        const error: SignUpErrors = {};

        if (!data.username || data.username.length < 6)
            error.username = true;

        if (!data.password || data.password.length < 6)
            error.password = true;

        if (!data.firstName || data.firstName.length < 2 || data.firstName.length > 50)
            error.firstName = true;

        if (!data.lastName || data.lastName.length < 2 || data.lastName.length > 50)
            error.lastName = true;

        // Simple check email
        if (!data.email || !data.email.includes("@"))
            error.email = true;

        setErrors(error);

        return Object.keys(error).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const formData: SignUpData = {
            firstName: firstNameRef.current?.value || "",
            lastName: lastNameRef.current?.value || "",
            username: usernameRef.current?.value || "",
            email: emailRef.current?.value || "",
            password: passwordRef.current?.value || "",
        };

        if (!validate(formData)) {
            return; // có lỗi thì dừng
        }
        setLoading(true);
        const isSignUp = await signup(formData);
        console.log(isSignUp)
        if (isSignUp) {
            navigator('/signin');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký tài khoản</h2>

                {/* Họ - Tên */}
                <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block mb-2 text-gray-900 font-medium">Họ</label>
                        <input
                            ref={lastNameRef}
                            type="text"
                            placeholder="Nhập họ"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                                ${errors.lastName ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-400"}`}
                        />
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">Họ không hợp lệ</p>
                        )}
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="block mb-2 text-gray-900 font-medium">Tên</label>
                        <input
                            ref={firstNameRef}
                            type="text"
                            placeholder="Nhập tên"
                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                                ${errors.firstName ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-400"}`}
                        />
                        {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">Tên không hợp lệ</p>
                        )}
                    </div>
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

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-2 text-gray-900 font-medium">Email</label>
                    <input
                        ref={emailRef}
                        type="email"
                        placeholder="Nhập email"
                        className={`w-full px-4 py-2 border rounded-lg focus:outline-none 
                            ${errors.email ? "border-red-500" : "border-gray-300 focus:ring-2 focus:ring-purple-400"}`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">Email không hợp lệ</p>
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
                        <p className="text-red-500 text-sm mt-1">Mật khẩu tối thiểu 6 ký tự</p>
                    )}
                </div>

                {/* Accept */}
                <label className="flex items-center space-x-2 cursor-pointer mb-4">
                    <input
                        type="checkbox"
                        checked={accept}
                        onChange={() => setAccept(!accept)}
                        className="w-4 h-4"
                    />
                    <p className="text-gray-600 text-sm">
                        Đồng ý với điều khoản và dịch vụ
                    </p>
                </label>

                {/* Submit */}
                <button
                    type="submit"
                    disabled={!accept || loading}
                    className={`w-full py-2 rounded-lg text-white transition-all duration-200
                        ${(accept && !loading) ? "bg-purple-500 hover:opacity-90" : "bg-gray-300 cursor-not-allowed"}
                    `}
                >
                    {loading ? 'Đăng ký...' : 'Đăng ký'}
                </button>
            </form>
        </div>
    );
};

export default SignUpPage;
