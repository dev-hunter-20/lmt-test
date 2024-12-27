'use client';

import React from 'react';
import { Switch as AntdSwitch } from 'antd';

import './Switch.scss';

const Switch = ({ value, onChange, disabled }) => {
  return (
    <div className="Switch">
      <AntdSwitch checked={value} onChange={onChange} disabled={disabled} />
    </div>
  );
};

export default Switch;
