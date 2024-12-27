'use client';

import React, { useState } from 'react';
import './Compare.scss';
import { Button, message, Modal, Table, Tooltip } from 'antd';
import { CloseOutlined, ExclamationCircleFilled, PlusOutlined, StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';
import { BASE_URL } from '@/common/constants';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';

const ModalCompare = dynamic(() => import('@/components/modal-compare/ModalCompare'), { ssr: false });
const { confirm } = Modal;

export default function Compare({ compareAppData }) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const match = pathname.match(/\/app\/([^\/]+)\/compare-app\/vs\/(.+)/);

  const dataRecommended = compareAppData[0]?.app_host?.categories || [];
  const dataRecommendedAppCompare = compareAppData[1]?.app_compare?.flatMap((cate) => cate.categories) || [];
  const match1 = match[1];
  const match2 = match[2];
  const match2AppIds = match2.split('-lmtvs-');
  const excludedAppIds = [match1, ...match2AppIds];
  const totalApps = 1 + match2AppIds.length;
  const canDelete = totalApps > 2;

  const extractAppDetails = (categories) => {
    if (!categories) return [];

    return categories
      .flatMap((category) => {
        if (!category || !category.top_3_apps) return [];
        return category.top_3_apps
          .map((app) => {
            if (app && app.detail) {
              return {
                app_id: app.detail.app_id,
                app_icon: app.detail.app_icon,
                name: app.detail.name,
              };
            }
            return null;
          })
          .filter((app) => app !== null);
      })
      .filter((app, index, self) => index === self.findIndex((t) => t.app_id === app.app_id));
  };

  const recommendedApps = extractAppDetails(dataRecommended);
  const recommendedAppCompare = extractAppDetails(dataRecommendedAppCompare);

  const filteredRecommendedApps = recommendedApps.filter((app) => !excludedAppIds.includes(app.app_id));
  const filteredRecommendedAppComapre = recommendedAppCompare.filter((app) => !excludedAppIds.includes(app.app_id));
  const combinedFilteredApps = [...filteredRecommendedAppComapre, ...filteredRecommendedApps];
  const uniqueCombinedFilteredApps = combinedFilteredApps.filter(
    (app, index, self) => index === self.findIndex((t) => t.app_id === app.app_id),
  );

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleDeleteAppCompare = (appId) => {
    confirm({
      title: 'Are you sure you want to delete this app compare?',
      icon: <ExclamationCircleFilled />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        const parts = pathname.split('/vs/');
        if (parts.length < 2) {
          message.error('Invalid URL format.');
          return;
        }

        const basePath = parts[0];
        const appIds = parts[1].split('-lmtvs-');
        const updatedAppIds = appIds.filter((id) => id !== appId);
        const originalAppId = basePath.split('/')[2];

        if (appId === originalAppId) {
          const newOriginalAppId = updatedAppIds.shift();
          const newBasePath = `/app/${newOriginalAppId}/compare-app`;
          const newPathname = `${newBasePath}/vs/${updatedAppIds.join('-lmtvs-')}`;
          message.success('App compare deleted successfully!');
          router.push(newPathname);
        } else {
          const newPathname = `${basePath}/vs/${updatedAppIds.join('-lmtvs-')}`;
          message.success('App compare deleted successfully!');
          router.push(newPathname);
        }
      },
      okButtonProps: {
        className: 'custom-ok-button',
      },
      cancelButtonProps: {
        className: 'custom-cancel-button',
      },
    });
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
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => ({
        key: item.detail?.app_id,
        icon: item.detail?.app_icon,
        name: item.detail?.name,
        star: item.detail?.star,
        reviewCount: item.detail?.review_count,
        id: item.detail?.app_id,
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
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => ({
      title: item.detail?.name || '',
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
          {canDelete && (
            <div className="close" onClick={() => handleDeleteAppCompare(value.id)}>
              <CloseOutlined />
            </div>
          )}
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

  return (
    <>
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
          appId={'AppId'}
          dataTabNew={(newData) => console.log(newData)}
          competitor={[]}
          recommendedApps={uniqueCombinedFilteredApps}
        />
      )}
    </>
  );
}
