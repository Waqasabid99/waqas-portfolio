import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Routes, Route } from "react-router";
import AdminDashboard from './admin/AdminDashboard.jsx';
import AdminLogin from './admin/Login.jsx';
import AdminSignup from './admin/Register.jsx';
import LoginModal from './components/auth/Login.jsx';
import ForgetPassword from './components/auth/ForgetPassword.jsx';
import ClientDashboard from './components/dashboard/ClientDashborad.jsx';
import SignupModal from './components/auth/Register.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
   <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />} />
      <Route path='login' element={<LoginModal />} />
      <Route path='register' element={<SignupModal />} />
      <Route path='forget-password' element={<ForgetPassword />} />
      <Route path='dashboard' element={<ClientDashboard />} />
      <Route path='/admin'>
        <Route path='/admin/register' element={<AdminSignup />} />
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
      </Route>
    </Routes>
    </BrowserRouter>
)
