import { useState } from 'react';
import { Link, useNavigate } from 'react-router'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../api/api';
import SEO from '../../hooks/SEO';
import useAuthStore from '../../store/authStore';


const LoginModal = () => {
  const { isLoading, login } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData)

    if (result?.success) {
      navigate('../dashboard')
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <SEO
        title={"Login | Waqas Ali Abid | Portfolio"}
        description={"Login to Waqas Ali Abid | Portfolio"}
        keywords={"Waqas Ali Abid, Login, Waqas, Ali, Abid"}
        image={""}
        url={""}
        type={"website"}
      />
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
        <Link
          to='/'
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </Link>
        <ToastContainer />
        <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Client Login</h2>

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

          <div className="flex justify-between items-center text-sm text-[#6e7b8d]">
            <Link to='../../forget-password' type="button" className="hover:text-[#1365ff]">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-[#6e7b8d]">
          Don’t have an account?{' '}
          <Link to='../register' className="text-[#1365ff] font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
