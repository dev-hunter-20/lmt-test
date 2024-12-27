"use client"

import React from 'react';
import classNames from 'classnames';
import { Table as AntdTable } from 'antd';

import './Table.scss';

const Table = ({ className, columns, dataSources, loading, rowKey = 'id', title, onChange }) => {
  return (
    <div className={classNames('Table', className)}>
      <div className="Table-body">
        <AntdTable
          pagination={false}
          columns={columns}
          dataSource={dataSources}
          loading={loading}
          rowKey={rowKey}
          title={title}
          onChange={onChange}
        />
      </div>
    </div>
  );
};

export default Table;
