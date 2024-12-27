'use client';

import React, { useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import './AuthForm.scss';
import Image from 'next/image';
import { dataAuthFormCarousel } from '@/utils/data/AuthForm';
import Carousels from '@/components/ui/carousel/Carousel';

const AuthForm = ({ children }) => {
  const [isSize, setIsSize] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsSize(window.innerWidth <= 990);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="AuthForm">
      <Row className="content">
        {!isSize && (
          <Col span={12}>
            <div className="AuthForm-carousel">
              <div className="AuthForm-carousel-bg">
                <Image src="/image/bg-auth-form.webp" alt="" width={100} height={100} className="img" />
              </div>
              <Carousels infinite dots arrows slidesToShow={1} slidesToScroll={1} autoplay>
                {[...dataAuthFormCarousel].map((item, index) => (
                  <div key={index} className="AuthForm-carousel-item">
                    <div className="AuthForm-carousel-item-image">
                      <Image src={item.image} alt="" width={500} height={450} />
                    </div>
                    <div className="AuthForm-carousel-item-title">{item.title}</div>
                    <div className="AuthForm-carousel-item-description">{item.description}</div>
                  </div>
                ))}
              </Carousels>
            </div>
          </Col>
        )}
        <Col span={isSize ? 24 : 12}>
          <div className="AuthForm-wrapper flex items-center justify-center">
            <div className="AuthForm-children">{children}</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default AuthForm;
