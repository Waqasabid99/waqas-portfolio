"use client";

import { useState } from 'react';
import CodeFactoryScene from './CodeFactoryScene';
import HireForm from './HireForm';

function Hero() {
  const [isHireFormOpen, setIsHireFormOpen] = useState(false)
  const handleHireClick = () => {
    setIsHireFormOpen(!isHireFormOpen);
  };

  const handleWhatsappClick = () => {
    window.open('https://wa.me/+923208703508', '_blank');
  };

  return (
    <>
      {isHireFormOpen ? (
        <div className="flex items-center justify-center">
          <HireForm onCloseClick={setIsHireFormOpen} />
        </div>
      ) : (
        <div id='home' className="mt-20 px-5 md:px-10 lg:px-20 flex flex-col md:flex-row items-center md:items-start gap-10">
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
              I'm <span className="text-[#1365ff] underline">Waqas Abid,</span>{' '}
              Full Stack Developer.
            </h1>

            <p className="text-[#b7bdbd] mt-4 mb-6 text-sm sm:text-base leading-relaxed">
              I'm a Full Stack Developer with over 3 years of experience. I specialize in
              building responsive, high-performing websites using React, Node.js, Express.js, PostgreSQL, MySQL, mongoDB and Shopify. Whether it's a custom design
              or optimization — I help businesses grow online with smart solutions.
            </p>

            <div className="flex flex-wrap gap-4">
              <button onClick={handleHireClick} className="rounded-full px-6 py-2 bg-[#1365ff] text-white border border-[#1365ff] transition hover:bg-white hover:text-[#1365ff]">
                Hire me
              </button>
              <button onClick={handleWhatsappClick} className="rounded-full px-6 py-2 bg-transparent border border-black text-black transition hover:bg-black hover:text-white">
                Whatsapp
              </button>
            </div>
          </div>

          <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
            <CodeFactoryScene />
          </div>
        </div>
      )}
    </>
  );
}

export default Hero;
