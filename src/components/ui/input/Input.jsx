'use client';

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { Input as AntdInput } from 'antd';
import './Input.scss';
import { ETimeoutDebounce } from '@/common/enums';
import { useDebounce } from '@/hooks/hooks';

const Input = ({
  className,
  type,
  size,
  readOnly,
  placeholder,
  prefix,
  suffix,
  onChange,
  onEnter,
  onSearch,
  value,
  autoFocus,
}) => {
  const [keyword, setKeyword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const searchValueDebounce = useDebounce(keyword, ETimeoutDebounce.SEARCH);

  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    setKeyword(inputValue);
    onChange?.(inputValue);
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      onEnter?.();
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) onSearch?.(searchValueDebounce);
  }, [searchValueDebounce]);

  return (
    <div className={classNames('Input', className, { affix: suffix || prefix })}>
      <AntdInput
        type={type}
        readOnly={readOnly}
        size={size}
        placeholder={placeholder}
        value={value}
        prefix={prefix}
        suffix={suffix}
        onChange={handleChange}
        onKeyDown={handleKeydown}
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default Input;
