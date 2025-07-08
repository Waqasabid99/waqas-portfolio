import React, { useState } from 'react';
import { FaArrowCircleRight, FaCode, FaRocket, FaPalette } from "react-icons/fa";
import { TbWorldCode, TbSeo } from "react-icons/tb";
import { BiTrendingUp, BiMobile, BiDesktop } from 'react-icons/bi';
import { FiPenTool, FiLayout, FiTrendingUp, FiShoppingCart } from 'react-icons/fi';
import { MdOutlineDesignServices } from 'react-icons/md';

const Services = () => {
    const [hoveredService, setHoveredService] = useState(null);

    const services = [
        {
            id: 1,
            icon: TbWorldCode,
            title: "Web Design & Development",
            description: "I create fast, responsive, and secure websites using modern technologies like React, WordPress, and custom HTML/CSS to ensure seamless functionality and a strong online presence.",
            features: ["Responsive Design", "Custom Development", "Performance Optimization", "Modern Frameworks"],
            bgColor: "bg-[#ecf2f8]",
            hoverColor: "group-hover:bg-[#1365ff]"
        },
        {
            id: 2,
            icon: BiTrendingUp,
            title: "Search Engine Optimization",
            description: "I optimize websites to improve visibility in search engines, drive organic traffic, and boost rankings through comprehensive on-page, off-page, and technical SEO strategies.",
            features: ["On-Page SEO", "Technical SEO", "Keyword Research", "Analytics & Reporting"],
            bgColor: "bg-[#f0f8ff]",
            hoverColor: "group-hover:bg-[#1365ff]"
        },
        {
            id: 3,
            icon: FiPenTool,
            title: "UI/UX Design",
            description: "I design intuitive, visually appealing, and user-centric interfaces that enhance user experience and drive engagement across web and mobile platforms.",
            features: ["User Research", "Wireframing", "Prototyping", "Visual Design"],
            bgColor: "bg-[#f8f0ff]",
            hoverColor: "group-hover:bg-[#1365ff]"
        },
        {
            id: 4,
            icon: FiShoppingCart,
            title: "E-Commerce Solutions",
            description: "I build comprehensive e-commerce platforms with secure payment gateways, inventory management, and user-friendly shopping experiences.",
            features: ["Shopify Development", "Payment Integration", "Inventory Management", "Mobile Commerce"],
            bgColor: "bg-[#f0fff8]",
            hoverColor: "group-hover:bg-[#1365ff]"
        },
        {
            id: 5,
            icon: MdOutlineDesignServices,
            title: "Content Writing",
            description: "I create compelling, SEO-optimized content that engages your audience and drives conversions across all digital platforms.",
            features: ["SEO Content", "Blog Writing", "Copy Writing", "Technical Writing"],
            bgColor: "bg-[#fff8f0]",
            hoverColor: "group-hover:bg-[#1365ff]"
        },
        {
            id: 6,
            icon: FaRocket,
            title: "Performance Optimization",
            description: "I optimize website speed, performance, and user experience to ensure fast loading times and better search engine rankings.",
            features: ["Speed Optimization", "Core Web Vitals", "Image Optimization", "Caching Solutions"],
            bgColor: "bg-[#f8fff0]",
            hoverColor: "group-hover:bg-[#1365ff]"
        }
    ];

    const handleSeeMore = () => {
        console.log('Navigating to services page...');
    };

    return (
        <div id='services' className='flex flex-col gap-6 pt-5 px-4 sm:px-8 lg:px-15 max-w-7xl mx-auto mb-10'>
            <div className="header-section">
                <div className="flex items-center justify-center sm:justify-start gap-3 mb-4">
                    <div className="w-3 h-2 bg-[#1365ff]"></div>
                    <h3 className='text-[#1365ff] text-xl font-semibold'>Services</h3>
                    <div className="w-3 h-2 bg-[#1365ff]"></div>
                </div>
                
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-end gap-6 mb-10">
                    <div className="text-center lg:text-left">
                        <h1 className='text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight'>
                            <span className='text-[#1365ff]'>Services</span> I Provide
                        </h1>
                        <p className='text-[#b7bdbd] mt-3 text-lg max-w-2xl'>
                            Comprehensive digital solutions to help your business thrive online
                        </p>
                    </div>
                    
                    {/* <div className='group'>
                        <button 
                            onClick={handleSeeMore}
                            className="contact rounded-full pl-6 pr-2 py-3 text-[#1365ff] bg-white inline-flex items-center gap-3 border-2 border-[#1365ff] group-hover:bg-[#1365ff] group-hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
                        >
                            See All Services
                            <FaArrowCircleRight className='text-2xl group-hover:translate-x-1 transition-transform duration-300' />
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="services-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {services.map((service) => (
                    <div 
                        key={service.id}
                        className={`service-card ${service.bgColor} rounded-2xl p-6 lg:p-8 group hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-transparent hover:border-[#1365ff] relative overflow-hidden`}
                        onMouseEnter={() => setHoveredService(service.id)}
                        onMouseLeave={() => setHoveredService(null)}
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 transform translate-x-8 -translate-y-8">
                            <service.icon className="w-full h-full text-[#1365ff]" />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="mb-6">
                                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-110">
                                    <service.icon className='text-[#1365ff] text-3xl' />
                                </div>
                            </div>
                            
                            <h2 className='text-xl lg:text-2xl font-bold text-zinc-800 mb-4 group-hover:text-[#1365ff] transition-colors duration-300'>
                                {service.title}
                            </h2>
                            
                            <p className='text-[#b7bdbd] leading-relaxed mb-6 group-hover:text-zinc-600 transition-colors duration-300'>
                                {service.description}
                            </p>
                            
                            <div className="mb-6">
                                <ul className="space-y-2">
                                    {service.features.map((feature, index) => (
                                        <li 
                                            key={index}
                                            className="flex items-center gap-2 text-sm text-[#b7bdbd] group-hover:text-zinc-600 transition-colors duration-300"
                                        >
                                            <div className="w-1.5 h-1.5 bg-[#1365ff] rounded-full"></div>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1365ff] to-[#0f4fb3] opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Services;