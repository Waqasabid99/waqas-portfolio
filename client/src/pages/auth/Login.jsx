"use client";

import { useAuthStore } from '@/store/authStore';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


const LoginModal = () => {
    const { isLoading, login, role } = useAuthStore();
    const [formData, setFormData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const router = useRouter()
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(formData)

        if (result) {
            router.push(`/${role?.toLowerCase()}/dashboard`)
        }
    };

    return (
        <div className="max-h-screen h-150 max-w-screen flex items-center justify-center px-4">
            <div className="bg-white max-w-md rounded-xl shadow-lg p-8 relative">
                <Link
                    href='/'
                    className="absolute top-3 right-4 text-gray-500 hover:animate-spin text-xl"
                >
                    <X />
                </Link>
                <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                    />

                    {/* <div className="flex justify-between items-center text-sm text-[#6e7b8d]">
                        <Link href='/forget-password' type="button" className="hover:text-[#1365ff]">
                            Forgot Password?
                        </Link>
                    </div> */}

                    <button
                        type="submit"
                        className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
                    >
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#6e7b8d]">
                    Don’t have an account?{' '}
                    <Link href='/register' className="text-[#1365ff] font-semibold hover:underline">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
