'use client';

import React from 'react';
import { Spin } from 'antd';
import './Loading.scss';

const Loading = ({ size = 'default', style }) => {
  const sizeIcon = (siz) => {
    switch (siz) {
      case 'large':
        return 'large';
      case 'small':
        return 'small';
      default:
        return 'default';
    }
  };

  return (
    <div className="Loading flex items-center justify-center" style={style}>
      <Spin size={sizeIcon(size)} />
    </div>
  );
};

export default Loading;
