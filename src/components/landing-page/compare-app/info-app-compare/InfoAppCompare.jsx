'use client';

import { BASE_URL } from '@/common/constants';
import { PlusOutlined, StarFilled } from '@ant-design/icons';
import { Button, Table, Tooltip } from 'antd';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import './InfoAppCompare.scss';

const ModalCompare = dynamic(() => import('@/components/modal-compare/ModalCompare'), { ssr: false });

export default function InfoAppCompare({ compareAppData, onAppAdd }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addedApps, setAddedApps] = useState([]);

  const dataAppCompare = [compareAppData[0]?.app_host, ...(compareAppData[1]?.app_compare || [])];

  const dataRecommended = compareAppData[0]?.app_host?.categories || [];
  const recommendedApps = dataRecommended
    .flatMap((category) =>
      category.top_3_apps.map((app) => ({
        app_id: app.detail.app_id,
        app_icon: app.detail.app_icon,
        name: app.detail.name,
      })),
    )
    .filter((app, index, self) => index === self.findIndex((t) => t.app_id === app.app_id));

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const transposedDataCompare = [
    {
      key: 'developer',
      title: (
        <div className="search-app">
          <Button type="dashed" icon={<PlusOutlined />} size="large" className="button-add" onClick={showModal}>
            Add competitor
          </Button>
        </div>
      ),
      values: dataAppCompare.map((item) => ({
        key: item?.detail?.app_id,
        icon: item?.detail?.app_icon,
        name: item?.detail?.name,
        star: item?.detail?.star,
        reviewCount: item?.detail?.review_count,
        id: item?.detail?.app_id,
      })),
    },
  ];

  const columnsCompare = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...dataAppCompare.map((item, index) => ({
      title: item?.detail?.name || '',
      dataIndex: `value${index}`,
      key: `value${index}`,
      width: 347,
    })),
  ];

  const dataSourceCompare = transposedDataCompare.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = (
        <>
          <div className="app">
            <div className="image">
              <Image src={value.icon} width={90} height={90} alt="Icon App" />
            </div>
            <div className="title-app">
              <Tooltip title={value.name}>
                <span className="app-name">{value.name}</span>
              </Tooltip>
              <div className="rating">
                <span className="star">
                  <StarFilled />
                  {value.star}
                </span>
                <span>&nbsp;|&nbsp;</span>
                <Link prefetch={false} href={`${BASE_URL}app/${value.id}/reviews`} className="review-count">
                  {value.reviewCount} reviews
                </Link>
              </div>
              <Link href={`${BASE_URL}app/${value.id}`} target={`_blank${value.id}`} className="view-detail">
                View Details
              </Link>
            </div>
          </div>
        </>
      );
    });
    return rowData;
  });

  const handleAppFromModal = (newApp) => {
    setAddedApps([...addedApps, newApp]);
    if (onAppAdd) {
      onAppAdd(newApp);
    }
  };

  return (
    <div>
      <div className="compare-app">
        <Table
          columns={columnsCompare}
          dataSource={dataSourceCompare}
          pagination={false}
          showHeader={false}
          scroll={{ x: 1500 }}
        />
      </div>
      {isModalVisible && (
        <ModalCompare
          visible={isModalVisible}
          disableModal={handleModalClose}
          onAddApp={handleAppFromModal}
          appId={'AppId'}
          dataTabNew={(newData) => console.log(newData)}
          competitor={[]}
          recommendedApps={recommendedApps}
        />
      )}
    </div>
  );
}
