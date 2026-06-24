"use client";

import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';

const SignupModal = () => {
    const { isLoading, register } = useAuthStore();
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '' });

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, }))
    };

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await register(formData)

        if (result?.success) {
            router.push('/login')
        }
    };

    return (
        <div className="max-h-screen h-150 max-w-screen flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
                <Link
                    href="/"
                    className="absolute top-3 right-4 text-gray-500 hover:animate-spin text-xl"
                >
                    <X />
                </Link>

                <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Create Account</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        required
                        value={formData.full_name}
                        onChange={handleChange}
                        className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                    />

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

                    <button
                        type="submit"
                        className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
                    >
                        {isLoading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-[#6e7b8d]">
                    Already have an account?{' '}
                    <Link href='/login' className="text-[#1365ff] font-semibold hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignupModal;
