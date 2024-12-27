'use client';
import Image from 'next/image';
import './ScrollToTop.scss';
import { useEffect, useState } from 'react';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div style={{ textAlign: 'center' }}>
      {isVisible && (
        // eslint-disable-next-line @next/next/no-img-element
        <Image
          src="/image/Icon-up.webp"
          alt=""
          className="scroll-to-top-button"
          width={40}
          height={40}
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default ScrollToTop;
