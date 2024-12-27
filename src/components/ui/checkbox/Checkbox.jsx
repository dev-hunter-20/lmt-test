'use client'

import React from 'react';
import { Checkbox as AntdCheckbox } from 'antd';
import './Checkbox.scss';

const Checkbox = ({ label, onChange, ...rest }) => {
  const handleChange = (e) => {
    const { checked } = e.target;
    onChange?.(checked);
  };
  return (
    <div className="Checkbox">
      <AntdCheckbox onChange={handleChange} {...rest}>
        <div className="Checkbox-label">{label}</div>
      </AntdCheckbox>
    </div>
  );
};

export default Checkbox;
