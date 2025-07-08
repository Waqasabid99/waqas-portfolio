import React, { useEffect, useState } from 'react';
import { FaArrowCircleRight, FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";
import { BiCode, BiTrendingUp } from 'react-icons/bi';
import { FiHeart, FiArrowUp } from 'react-icons/fi';

const Footer = (props) => {
    
    const currentYear = new Date().getFullYear();

    const quickLinks = [
        { name: 'Home', href: '#home' },
        { name: 'About', href: '#about' },
        { name: 'Services', href: '#services' },
        { name: 'Portfolio', href: '#portfolio' },
        { name: 'Contact', href: '#contact' }
    ];

    const services = [
        { name: 'Web Development', href: '#web-dev' },
        { name: 'Web Design', href: '#web-design' },
        { name: 'SEO Optimization', href: '#seo' },
        { name: 'Content Writing', href: '#content' },
        { name: 'UI/UX Design', href: '#ui-ux' }
    ];

    const socialLinks = [
        { icon: FaLinkedin, href: 'https://www.linkedin.com/in/ali-abid-webpydev/', label: 'LinkedIn' },
        { icon: FaGithub, href: 'https://github.com/Waqasabid99', label: 'GitHub' },
        { icon: FaTwitter, href: 'https://x.com/WaqasAliAbid998', label: 'Twitter' },
        { icon: FaInstagram, href: 'https://www.freelancer.com/u/sehrishabid130', label: 'Freelancer' }
    ];

    return (
        <footer id='contact' className="bg-[#1a1b23] text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-5">
                <div className="absolute top-10 left-10 w-20 h-20 border border-[#1365ff] rounded-full"></div>
                <div className="absolute top-32 right-20 w-16 h-16 bg-[#1365ff] rounded-full opacity-20"></div>
                <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-[#1365ff] rotate-45"></div>
                <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-[#1365ff] rotate-45 opacity-30"></div>
            </div>

            <div className="relative px-15 pt-16 pb-8">
                <div className="bg-gradient-to-r from-[#1365ff] to-[#0f4fb3] rounded-2xl p-8 mb-12 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-black opacity-10"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Let's work together to bring your ideas to life with modern web solutions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button onClick={props.onContactClick} className="hire-me rounded-full px-8 py-3 bg-white text-[#1365ff] border-2 border-white hover:bg-transparent hover:text-white hover:border-white transition-all duration-300 font-medium flex items-center gap-2">
                                <FaEnvelope className="text-lg" />
                                Get In Touch
                            </button>
                            <button onClick={props.onWhatsClick} className="whatsapp-me rounded-full px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1365ff] transition-all duration-300 font-medium flex items-center gap-2">
                                <FaWhatsapp className="text-lg" />
                                WhatsApp Me
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-3 h-2 bg-[#1365ff]"></div>
                            <h3 className="text-xl font-semibold text-[#1365ff]">Waqas Abid</h3>
                            <div className="w-3 h-2 bg-[#1365ff]"></div>
                        </div>
                        <p className="text-[#b7bdbd] leading-relaxed">
                            Passionate web developer with 5+ years of experience creating digital solutions
                            that help businesses grow online.
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 bg-[#2a2b35] rounded-full flex items-center justify-center text-[#1365ff] hover:bg-[#1365ff] hover:text-white transition-all duration-300 hover:scale-110"
                                >
                                    <social.icon className="text-lg" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.href}
                                        className="text-[#b7bdbd] hover:text-[#1365ff] transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 bg-[#1365ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Services</h3>
                        <ul className="space-y-2">
                            {services.map((service, index) => (
                                <li key={index}>
                                    <a
                                        href={service.href}
                                        className="text-[#b7bdbd] hover:text-[#1365ff] transition-colors duration-300 flex items-center gap-2 group"
                                    >
                                        <div className="w-1 h-1 bg-[#1365ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        {service.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-[#b7bdbd]">
                                <FaMapMarkerAlt className="text-[#1365ff] text-lg flex-shrink-0" />
                                <span>Lodhran, Punjab, Pakistan</span>
                            </div>
                            <div className="flex items-center gap-3 text-[#b7bdbd]">
                                <FaEnvelope className="text-[#1365ff] text-lg flex-shrink-0" />
                                <a href="mailto:contact@waqasabidwork.com" className="hover:text-[#1365ff] transition-colors duration-300">
                                    contact@waqasabidwork.online
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-[#b7bdbd]">
                                <FaPhone className="text-[#1365ff] text-lg flex-shrink-0" />
                                <a href="tel:+923001234567" className="hover:text-[#1365ff] transition-colors duration-300">
                                    +92 320 870 3508
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-[#2a2b35] pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-2 text-[#b7bdbd]">
                            <span>© {currentYear} Waqas Abid. Made with</span>
                            <FiHeart className="text-[#1365ff] animate-pulse" />
                            <span>in Pakistan</span>
                        </div>

                        <div className="flex items-center gap-6">
                            <a href="#privacy" className="text-[#b7bdbd] hover:text-[#1365ff] transition-colors duration-300 text-sm">
                                Privacy Policy
                            </a>
                            <a href="#terms" className="text-[#b7bdbd] hover:text-[#1365ff] transition-colors duration-300 text-sm">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;