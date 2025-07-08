import React from 'react';
import Marquee from 'react-fast-marquee';

const ServMarquee = () => {
  return (
    <div className="w-full mt-7">
      <div className="bg-[#34353e] h-5 md:h-6 lg:h-8 w-full rotate-[0.1deg]"></div>

      <div className="relative -top-15">
        <Marquee
          gradient={false}
          speed={40}
          className="bg-[#1365ff] py-3 text-sm sm:text-base"
        >
          <span className="text-white font-medium mx-6 whitespace-nowrap">
            Website Development <span className="mx-6 text-xl">✦</span>
            Search Engine Optimization <span className="mx-6 text-xl">✦</span>
            Google/Facebook Ads Management <span className="mx-6 text-xl">✦</span>
            UI/UX Design <span className="mx-6 text-xl">✦</span>
          </span>
        </Marquee>
      </div>
    </div>
  );
};

export default ServMarquee;
