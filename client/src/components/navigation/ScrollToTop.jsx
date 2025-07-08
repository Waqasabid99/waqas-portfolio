import React, { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react';

function ScrollToTop() {
    const [ShowButton, setShowButton] = useState(false)
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
    ShowButton && (
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-[#1365ff] text-white p-3 rounded-full shadow-lg hover:bg-white hover:text-[#1365ff] transition z-50"
        aria-label="Scroll to Top"
      >
        <ArrowUp size={20} />
      </button>
    )
  );
}

export default ScrollToTop
