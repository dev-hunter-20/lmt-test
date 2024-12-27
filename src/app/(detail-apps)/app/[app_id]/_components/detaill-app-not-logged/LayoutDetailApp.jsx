'use client';

import { Breadcrumb, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import './LayoutDetailApp.scss';
import { useParams, usePathname, useRouter } from 'next/navigation';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import InfoApp from './info-app/InfoApp';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';

export default function LayoutDetailApp({ children }) {
  const [activeTab, setActiveTab] = useState('app-info');
  const pathname = usePathname();
  const router = useRouter();
  const { app_id: id } = useParams();

  const { data: infoApp, isLoading: loadingAppInfo } = useQuery({
    queryKey: ['fetchInfoApp', id],
    queryFn: () => DetailAppApiService.getAppInfo(id),
  });

  const nameApps = infoApp?.data ? infoApp.data.detail.name : '';
  const countReviews = infoApp?.data ? infoApp.data.detail.review_count : 0;

  const handleBack = () => {
    router.back();
  };

  const items = [
    {
      key: 'app-info',
      label: 'App Info',
      path: `/app/${id}`,
    },
    {
      key: 'pricing',
      label: 'Pricing',
      path: `/app/${id}/pricing`,
    },
    {
      key: 'reviews',
      label: `Reviews (${countReviews})`,
      path: `/app/${id}/reviews`,
    },
  ];

  useEffect(() => {
    const matchingItem = items.find((item) => pathname.includes(item.key));
    if (matchingItem) {
      setActiveTab(matchingItem.key);
    }
  }, [pathname]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    const selectedTab = items.find((item) => item.key === key);
    if (selectedTab) {
      router.push(selectedTab.path);
    }
  };

  return (
    <div className={`container-detail-app`}>
      <div className="header-detail_app">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item className="link">
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              App
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">{nameApps}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="content-app">
        <div className="info-app container">
          <InfoApp loadingAppInfo={loadingAppInfo} infoApp={infoApp} id={id} />
        </div>
        <div className="tabs-app container">
          <Tabs
            activeKey={activeTab}
            defaultActiveKey="app-info"
            onChange={handleTabChange}
            items={items.map((item) => ({
              key: item.key,
              label: item.label,
            }))}
          />
          <div className="tab-content">{children}</div>
        </div>
      </div>
    </div>
  );
}
