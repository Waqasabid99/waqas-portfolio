import React, { useEffect, useState } from 'react';
import { Menu, X, Bell, Search, Filter, Calendar, Clock, CheckCircle, AlertCircle, User, LogOut, Settings, RefreshCw, Link } from 'lucide-react';
import { useNavigate } from 'react-router'
import axios from 'axios'

const ClientNavbar = ({ onLogout, clientName = "Client Dashboard", user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const navigate = useNavigate()

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('https://routes.waqasabidwork.online/logout', {}, {
        withCredentials: true
      });

      if (response.status === 200) {
        if (onLogout) {
          onLogout();
        }
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header
      className={`max-w-[91%] mb-3 bg-[#e5eff9] px-5 sm:px-10 py-4 rounded-full mx-auto mt-5 sticky top-0 z-50 transition-all duration-300 ${isSticky ? 'max-w-full rounded-none shadow-lg' : 'bg-[#e5eff9]'
        }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-[#1365ff]">
          <a href="/">WaqasAbid</a>
        </h1>

        <nav className="hidden md:flex items-center gap-10 text-[#6e7b8d] text-sm">
          <ul className="flex gap-8">
            <li><a href="#dashboard" className="hover:text-[#1365ff] transition">Dashboard</a></li>
            <li><a href="#projects" className="hover:text-[#1365ff] transition">Projects</a></li>
            <li><a href="#reports" className="hover:text-[#1365ff] transition">Reports</a></li>
            <li><a href="#support" className="hover:text-[#1365ff] transition">Support</a></li>
          </ul>
          <div className='flex gap-4 items-center'>
            <button className="p-2 rounded-full hover:bg-white/50 transition">
              <Bell size={20} className="text-[#1365ff]" />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-2 rounded-full hover:bg-white/50 transition"
              >
                <User size={20} className="text-[#1365ff]" />
                {user && <span className="text-sm font-medium">{user.full_name}</span>}
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user?.full_name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <button className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2">
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </nav>

        <button
          onClick={toggleMenu}
          className="md:hidden text-[#1365ff] focus:outline-none"
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden mt-4 bg-white rounded-xl shadow-lg py-4 px-6 text-sm text-[#6e7b8d]">
          <ul className="flex flex-col gap-4">
            <li className="hover:text-[#1365ff] cursor-pointer transition">Dashboard</li>
            <li className="hover:text-[#1365ff] cursor-pointer transition">Projects</li>
            <li className="hover:text-[#1365ff] cursor-pointer transition">Reports</li>
            <li className="hover:text-[#1365ff] cursor-pointer transition">Support</li>
          </ul>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">{user?.full_name}</p>
            <p className="text-xs text-gray-500 mb-4">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full rounded-full px-5 py-2 bg-red-500 text-white border border-red-500 hover:bg-white hover:text-red-500 transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default ClientNavbar