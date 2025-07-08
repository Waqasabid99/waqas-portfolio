import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from "react-router";

function Navbar(props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 80);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`max-w-[91%] mb-3 bg-[#e5eff9] px-5 sm:px-10 py-4 rounded-full max-w-full-xl mx-auto mt-5 sticky top-0 z-1000 ${isSticky ? 'max-w-screen rounded-none' : 'bg-[#e5eff9]'}`}>
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-bold text-[#1365ff]"><a href="/">WaqasAbid</a></h1>

        <nav className="hidden md:flex items-center gap-10 text-[#6e7b8d] text-sm">
          <ul className="flex gap-8">
            <li><a href="#home" className="hover:text-[#1365ff]">Home</a></li>
            <li><a href="#services" className="hover:text-[#1365ff]">Services</a></li>
            <li><a href="#about" className="hover:text-[#1365ff]">About</a></li>
            <li><a href="#portfolio" className="hover:text-[#1365ff]">Projects</a></li>
            <li><a href="#contact" className="hover:text-[#1365ff]">Contact</a></li>
          </ul>
          <div className='flex gap-4'>
          <button onClick={props.onWhatsClick} className="ml-6 rounded-full px-5 py-2 bg-[#1365ff] text-white border border-[#1365ff] hover:bg-white hover:text-[#1365ff] transition">
            Contact me
          </button>
          <Link to='login' className="rounded-full px-5 py-2 bg-white text-[#1365ff] border border-[#1365ff] hover:bg-[#1365ff] hover:text-white transition">Login</Link>
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
            <li className="hover:text-[#1365ff] cursor-pointer">Home</li>
            <li className="hover:text-[#1365ff] cursor-pointer">About</li>
            <li className="hover:text-[#1365ff] cursor-pointer">Projects</li>
            <li className="hover:text-[#1365ff] cursor-pointer">Contact</li>
          </ul>
          <button onClick={props.onWhatsClick} className="mt-4 w-full rounded-full px-5 py-2 bg-[#1365ff] text-white border border-[#1365ff] hover:bg-white hover:text-[#1365ff] transition">
            Contact me
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
