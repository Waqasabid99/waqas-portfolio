import axios from 'axios';
import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupModal = ({ onLoginClick }) => {
  const [formData, setFormData] = useState({ full_name: '', email: '', password: ''});

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value, }))
  };

  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signup Data:', formData);
    axios.post('https://waqas-portfolio-qlpx.onrender.com/register', formData, { withCredentials: true }).then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message)
        setTimeout(() => {
          navigate('../dashboard')
        }, 2000);
      } else {
        toast.error(response.data.message)
      }
    })
    .catch((error) => {
      toast.error(error.response?.data?.message || 'Registration failed');
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
        <Link
          to='/'
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </Link>

        <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Create Account</h2>

        <ToastContainer />
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
            Sign Up
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#6e7b8d]">
          Already have an account?{' '}
          <Link to='../login' className="text-[#1365ff] font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupModal;
