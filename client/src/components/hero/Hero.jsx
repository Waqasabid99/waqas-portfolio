import React from 'react';
import heroImage from '../../assets/bg-img.png';
import HireForm from './HireForm';

function Hero(props) {
  return (
    <div id='home' className="mt-20 px-5 md:px-10 lg:px-20 flex flex-col md:flex-row items-center md:items-start gap-10">
      <div className="w-full md:w-1/2">
        <div className="relative mb-4">
          <div className="absolute w-3 h-2 bg-[#1365ff] top-6 left-[-6px]"></div>
          <div className="absolute w-3 h-2 bg-[#1365ff] top-6 left-[14.5%]"></div>
          <p className=" z-10 border-1 border-black py-1 px-5 inline-block text-sm text-[#1365ff] bg-white">
            Hello !
          </p>
          <div className="absolute w-3 h-2 bg-[#1365ff] top-[-2px] left-[-5px]"></div>
          <div className="absolute w-3 h-2 bg-[#1365ff] top-[-2px] left-19.5"></div>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-tight">
          I'm <span className="text-[#1365ff] underline">Waqas Abid,</span>{' '}
          Web Designer & Developer.
        </h1>

        <p className="text-[#b7bdbd] mt-4 mb-6 text-sm sm:text-base leading-relaxed">
          I'm a Web Developer with over 5 years of experience. I specialize in
          building responsive, high-performing websites using WordPress, HTML,
          CSS, JavaScript, Bootstrap, and Shopify. Whether it's a custom design
          or optimization — I help businesses grow online with smart solutions.
        </p>

        <div className="flex flex-wrap gap-4">
          <button onClick={props.onHireClick} className="rounded-full px-6 py-2 bg-[#1365ff] text-white border border-[#1365ff] transition hover:bg-white hover:text-[#1365ff]">
            Hire me
          </button>
          <button onClick={props.onWhatsClick} className="rounded-full px-6 py-2 bg-transparent border border-black text-black transition hover:bg-black hover:text-white">
            Whatsapp
          </button>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
        <img
          src={heroImage}
          alt="Hero"
          className="w-[80%] max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
        />
      </div>
    </div>
  );
}

export default Hero;
