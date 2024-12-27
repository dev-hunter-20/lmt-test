'use client';

import React from 'react';
import { Pagination as AntdPagination } from 'antd';
import classNames from 'classnames';

import './Pagination.scss';

const Pagination = ({ page, pageSize, total = 0, hideOnSinglePage, showTotal, className, onChange }) => {
  return (
    <div className={classNames('Pagination', className)}>
      <AntdPagination
        current={page}
        pageSize={pageSize}
        total={total}
        hideOnSinglePage={hideOnSinglePage}
        onChange={onChange}
        showTotal={showTotal}
      />
    </div>
  );
};

export default Pagination;
