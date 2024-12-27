'use client';

import { Select } from 'antd';
import React from 'react';
import { DownOutlined } from '@ant-design/icons';

export default function SelectByLanguage(props) {
  const { Option } = Select;
  const OPTION_BY_LANGUAGE = [
    { value: 'uk', label: 'England' },
    { value: 'es', label: 'Spain' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'cn', label: 'China' },
    { value: 'tw', label: 'Hong Kong' },
  ];

  return (
    <div style={{ position: 'relative' }}>
      <Select
        value={props.selectValue}
        onChange={props.handleSelectChange}
        style={{ width: '120px' }}
        disabled={props.disabled}
        suffixIcon={<DownOutlined style={{display: "flex"}} />}
      >
        {OPTION_BY_LANGUAGE.map((item) => (
          <Option key={item.value} value={item.value}>
            {item.label}
          </Option>
        ))}
      </Select>
    </div>
  );
}
