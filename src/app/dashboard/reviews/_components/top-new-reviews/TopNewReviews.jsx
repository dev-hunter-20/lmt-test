'use client';

import React from 'react';
import './TopNewReviews.scss';
import { Table } from 'antd';
import { StarFilled } from '@ant-design/icons';
import Link from 'next/link';

export default function TopNewReviews(props) {
  const renderData = (data) => {
    return data.map((item) => {
      return {
        reviewer: {
          reviewer_name: item.reviewer_name,
          location: item.reviewer_location,
        },
        content: item.content || '',
        date: item.create_date,
        star: item.star,
        location: item.reviewer_location,
        app: item,
        int_id: item.int_id,
      };
    });
  };

  const columns = [
    {
      title: 'Reviewer',
      dataIndex: 'reviewer',
      render: (item) => (
        <>
          <Link
            prefetch={false}
            href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.location}`}
          >
            {item.reviewer_name}
          </Link>
        </>
      ),
      sortDirections: ['descend', 'ascend'],
      width: 200,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      sortDirections: ['descend', 'ascend'],
      width: 150,
    },
    {
      title: 'For app',
      dataIndex: 'app',
      render: (item) => (
        <>
          <Link prefetch={false} href={`/app/${item.app_id}`}>
            {item.app_name}
          </Link>
        </>
      ),
      sortDirections: ['descend', 'ascend'],
      width: 250,
    },
    {
      title: 'Content',
      dataIndex: 'content',
      sortDirections: ['descend', 'ascend'],
      className: 'content-column',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sortDirections: ['descend', 'ascend'],
      width: 120,
    },
    {
      title: 'Star',
      dataIndex: 'star',
      sortDirections: ['descend', 'ascend'],
      render: (item) => (
        <>
          {item}
          <span>
            <StarFilled style={{ marginLeft: '3px', color: '#ffc225' }} />
          </span>
        </>
      ),
      width: 100,
    },
  ];
  return (
    <div className="dashboard-table">
      <Table
        columns={columns}
        dataSource={renderData(props.data)}
        pagination={false}
        scroll={{ y: 500, x: 1000 }}
        loading={props.loading}
      />
    </div>
  );
}
