"use client";

import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { NAVLINKS } from '@/constants/constant';

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
            className={`max-w-7xl w-screen mb-3 bg-[#e5eff9] px-5 sm:px-10 py-4 rounded-full mx-auto mt-5 sticky top-0 z-1000 ${isSticky ? 'max-w-screen rounded-none' : 'bg-[#e5eff9]'} transition-all duration-400 ease-in-out`}>
            <div className="flex justify-between items-center">
                <h1 className="text-lg font-bold text-[#1365ff]"><Link href="/">WaqasAbid</Link></h1>

                <nav className="hidden md:flex items-center gap-10 text-[#6e7b8d] text-sm">
                    <ul className="flex gap-8">
                        {NAVLINKS?.map((link) => (
                            <Link key={link?.id} href={link?.href} className="hover:text-[#1365ff]">
                                {link?.title}
                            </Link>
                        ))}
                    </ul>
                    <div className='flex gap-4'>
                        <button onClick={props.onWhatsClick} className="ml-6 rounded-full px-5 py-2 bg-[#1365ff] text-white border border-[#1365ff] hover:bg-white hover:text-[#1365ff] transition">
                            Contact me
                        </button>
                        <Link href='/login' className="rounded-full px-5 py-2 bg-white text-[#1365ff] border border-[#1365ff] hover:bg-[#1365ff] hover:text-white transition">
                            Login
                        </Link>
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
                        {NAVLINKS?.map((link) => (
                            <Link key={link?.id} href={link?.href} className="hover:text-[#1365ff]">
                                {link?.title}
                            </Link>
                        ))}
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
