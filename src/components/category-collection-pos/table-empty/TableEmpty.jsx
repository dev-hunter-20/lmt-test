'use client';

import React from 'react';
import { Empty } from 'antd';
import './TableEmpty.scss';

export default function TableEmpty({ title }) {
  return (
    <div className="header-empty">
      <div className="table-empty">
        <div className="title">{title}</div>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    </div>
  );
}
