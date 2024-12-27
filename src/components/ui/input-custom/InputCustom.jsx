'use client';

import { Input } from 'antd';
import React, { useState } from 'react';
import './InputCustom.scss'

export default function InputCustom(props) {
  const [count, setCount] = useState(props.value ? props.value.length : 0);

  const changeInputCustom = (event) => {
    setCount(event.target.value.length);
    props.changeInput(event.target.value);
  };
  return (
    <Input
      placeholder={props.placeholder}
      maxLength={props.maxLength}
      suffix={
        <div className="text-count">
          {count}/{props.maxLength}
        </div>
      }
      value={props.value}
      onChange={changeInputCustom}
    />
  );
}
