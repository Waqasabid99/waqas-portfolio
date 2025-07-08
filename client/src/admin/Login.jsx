import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://routes.waqasabidwork.online/admin/login', formData, {
        withCredentials: true, 
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.data.success) {
        // Admin login successful
        console.log('Admin logged in:', response.data.admin);
        navigate('/admin/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle axios error response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Admin Login</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            required
            value={formData.email}
            onChange={handleChange}
            disabled={loading}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#1365ff] disabled:opacity-50"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className="w-full border px-4 py-2 rounded-md focus:ring-2 focus:ring-[#1365ff] disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/admin/register')}
              className="text-[#1365ff] hover:underline"
            >
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;