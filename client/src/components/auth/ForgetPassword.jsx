import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ForgetPassword = () => {
  const [formData, setFormData] = useState({ email: '' , password: '', confirmpassword: ''})
  const [error, setError] = useState('')
  const [emailIsVerfied, setemailIsVerfied] = useState(false)
  const navigate = useNavigate();

  const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => {
    const updatedForm = { ...prev, [name]: value };

    if (updatedForm.password !== updatedForm.confirmpassword) {
      setError('Passwords do not match');
    } else {
      setError('');
    }

    return updatedForm;
  });

  console.log(formData);
};

  const handleEmailSubmit = (e) => {
    e.preventDefault()
    axios.post('https://waqas-portfolio-qlpx.onrender.com/forget-password', formData).then((response)=>{
      if (response.data.success === true) {
        setemailIsVerfied(true)
      } 
      if(response.data.success === false) {
        toast.error(response.data.message)
      }
      console.log(response)
    })
  }

  const handleChangePassword = (e) => {
    e.preventDefault()
    axios.post('https://waqas-portfolio-qlpx.onrender.com/reset-password', formData).then((response) => {
      if (response.data.success === true) {
        toast.success(response.data.message)
        setTimeout(() => {
          navigate('../login')
        }, 2000);
      } else { 
        toast.error(response.data.message)
      }
    })
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-[#1365ff] mb-6 text-center">Reset Your Password</h2>

        <form className="space-y-5" onSubmit={handleEmailSubmit}>
          {!emailIsVerfied && (
            <>
            <ToastContainer />
              <input
                value={formData.email}
                onChange={handleChange}
                type="email"
                name="email"
                placeholder="Enter your registered email"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                required
              />

              <button
                type="submit"
                className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
              >
                Verify Email
              </button>
            </>
          )}
          </form>

          <form className="space-y-5" onSubmit={handleChangePassword}>
          {emailIsVerfied && (
            <>
              <input
                value={formData.password}
                onChange={handleChange}
                type="password"
                name="password"
                placeholder="New Password"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                required
              />

              <input
                value={formData.confirmpassword}
                onChange={handleChange}
                type="password"
                name="confirmpassword"
                placeholder="Repeat Password"
                className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1365ff]"
                required
              />
              <p className='text-red-700 text-[10px]'>{error}</p>
              <button
                type="submit"
                className="w-full bg-[#1365ff] text-white py-2 rounded-full hover:bg-white hover:text-[#1365ff] border border-[#1365ff] transition"
              >
                Change Password
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;
