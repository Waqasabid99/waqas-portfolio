import React from 'react';
import aboutUs from '../../assets/about-us.png'
import { FaArrowCircleRight, FaDownload } from 'react-icons/fa';
import { BiCode, BiTrendingUp, BiHeart } from 'react-icons/bi';

const About = () => {
  const handleDownloadCV = () => {
    window.open("https://limewire.com/d/MMqIk#t4lqPL9d8Q","_blank")
    console.log('Downloading CV...');
  };

  const stats = [
    {
      icon: BiCode,
      number: '12+',
      label: 'Projects Completed',
      color: 'text-white'
    },
    {
      icon: BiTrendingUp,
      number: '5+',
      label: 'Years Experience',
      color: 'text-white'
    },
    {
      icon: BiHeart,
      number: '12+',
      label: 'Happy Clients',
      color: 'text-white'
    }
  ];

  return (
    <div id='about' className="relative bg-[#1365ff] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white opacity-10 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white opacity-5 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 border-2 border-white opacity-10 rotate-45"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white opacity-10 rotate-45"></div>
        <div className="absolute top-1/2 left-0 w-24 h-24 border-2 border-white opacity-5 rounded-full transform -translate-x-1/2"></div>
        <div className="absolute top-1/4 right-0 w-32 h-32 bg-white opacity-5 rounded-full transform translate-x-1/2"></div>
      </div>

      <div className="relative px-4 sm:px-8 lg:px-15 py-12 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-16 xl:gap-20">
            
            <div className="w-full lg:w-auto lg:max-w-[400px] xl:max-w-[450px] flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 rounded-full border-4 border-white opacity-20 scale-110 group-hover:scale-125 transition-transform duration-500"></div>
                <div className="absolute inset-0 rounded-full border-2 border-white opacity-10 scale-125 group-hover:scale-140 transition-transform duration-700"></div>
                
                <div className="relative w-80 h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white shadow-2xl group-hover:shadow-3xl transition-all duration-500">
                  <img
                    src={aboutUs}
                    alt="Waqas Ali Abid - Web Developer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1365ff] via-transparent to-transparent opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                </div>
                
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -left-4 w-4 h-4 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="text-white w-full lg:max-w-[60%] xl:max-w-[55%] text-center lg:text-left">
              
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                <div className="w-3 h-2 bg-white"></div>
                <h3 className="text-xl font-semibold">About Me</h3>
                <div className="w-3 h-2 bg-white"></div>
              </div>

              <h2 className="text-3xl sm:text-4xl xl:text-5xl font-bold mb-6 leading-tight">
                Who is <span className="relative">
                  Waqas Ali Abid
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white opacity-30 rounded-full"></div>
                </span>?
              </h2>

              <p className="text-lg sm:text-xl leading-relaxed mb-8 opacity-90">
                I'm a passionate Web Developer with over 5 years of experience creating digital experiences that matter. 
                I specialize in building responsive, high-performing websites using modern technologies like WordPress, 
                React, HTML, CSS, JavaScript, and Shopify. Whether it's custom design, optimization, or full-stack development — 
                I help businesses establish a powerful online presence with innovative solutions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center lg:text-left group">
                    <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                      <stat.icon className="text-2xl opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                      <h3 className="text-3xl xl:text-4xl font-bold group-hover:scale-110 transition-transform duration-300">
                        {stat.number}
                      </h3>
                    </div>
                    <h4 className="text-sm sm:text-base opacity-80 font-medium">
                      {stat.label}
                    </h4>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={handleDownloadCV}
                  className="group bg-white text-[#1365ff] rounded-full px-8 py-3 font-semibold border-2 border-white hover:bg-transparent hover:text-white transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <FaDownload className="text-lg group-hover:animate-bounce" />
                  Download CV
                  <FaArrowCircleRight className="text-xl group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none" 
          className="relative block w-full h-12 sm:h-16 lg:h-20"
        >
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="white" 
            fillOpacity="0.1"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default About;