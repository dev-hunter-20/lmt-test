'use client';

import React, { useRef, useState } from 'react';
import { Table } from 'antd';
import ModalListApp from './ModalListApp';

const NewDeveloper = (props) => {
  const [showApps, setShowApps] = useState(false);

  const idDeveloper = useRef();

  const renderData = (data) => {
    return data.map((item) => {
      return {
        ...item,
        developer: {
          developer_name: item.name,
          developer_id: item._id,
        },
        apps: {
          count: item.apps.length,
          _id: item._id,
        },
        created_at: item.created_at.substring(0, 10),
      };
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'developer',
      render: (item) => (
        <>
          <a href={`/developer/${item.developer_id}`}>{item.developer_name}</a>
        </>
      ),
      sortDirections: ['descend', 'ascend'],
      width: 350,
    },
    {
      title: 'Applications',
      dataIndex: 'apps',
      render: (item) => (
        <>
          <a
            onClick={() => {
              setShowApps(true);
              idDeveloper.current = item._id;
            }}
          >
            {`${item.count}${item.count > 1 ? ' apps' : ' app'}`}
          </a>
        </>
      ),
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Date',
      dataIndex: 'created_at',
      sortDirections: ['descend', 'ascend'],
    },
  ];

  const handleCancel = () => {
    setShowApps(false);
  };
  return (
    <div className="dashboard-table">
      {showApps && <ModalListApp id={idDeveloper.current} handleCancel={handleCancel} />}
      <Table
        columns={columns}
        dataSource={renderData(props.data)}
        pagination={false}
        loading={props.loading}
        scroll={{ y: 400 }}
      />
    </div>
  );
};

export default NewDeveloper;
