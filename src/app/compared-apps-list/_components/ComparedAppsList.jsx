'use client';

import React, { useEffect, useState } from 'react';
import './ComparedAppsList.scss';
import { ArrowLeftOutlined, CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { BASE_URL } from '@/common/constants';
import CompareAppService from '@/api-services/api/CompareAppApiService';
import { Breadcrumb, Empty, message, Spin, Tooltip } from 'antd';
import { useRouter } from 'next/navigation';

export default function ComparedAppsList() {
  const [comparedAppsSets, setComparedAppsSets] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const appListSaved = JSON.parse(localStorage.getItem('COMPARISON_LISTS')) || [];

    if (appListSaved.length > 0) {
      appListSaved.forEach(async (path) => {
        const [baseApp, compareApps] = extractAppIdsFromPath(path);
        if (baseApp && compareApps) {
          await fetchAppDetails(baseApp, compareApps, path);
        }
      });
    } else {
      setLoading(false);
    }
  }, []);

  const extractAppIdsFromPath = (path) => {
    const parts = path.split('/vs/');
    if (parts.length < 2) return [null, null];
    const baseApp = parts[0].split('/app/')[1].split('/compare-app')[0];
    const compareApps = parts[1];
    return [baseApp, compareApps];
  };

  const fetchAppDetails = async (baseApp, compareApps, path) => {
    try {
      const response = await CompareAppService.compareApps(baseApp, compareApps);
      const appHost = response.data[0]?.app_host;
      const appCompare = response.data[1]?.app_compare;

      if (appHost) {
        setComparedAppsSets((prevSets) => ({
          ...prevSets,
          [path]: {
            app_host: appHost,
            app_compare: appCompare || [],
          },
        }));
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching app details:', error);
      setLoading(false);
    }
  };

  const removeComparison = (path) => {
    const appListSaved = JSON.parse(localStorage.getItem('COMPARISON_LISTS')) || [];
    const updatedList = appListSaved.filter((item) => item !== path);
    localStorage.setItem('COMPARISON_LISTS', JSON.stringify(updatedList));

    setComparedAppsSets((prevSets) => {
      const newSets = { ...prevSets };
      delete newSets[path];
      return newSets;
    });
    message.success('App removed from comparison list successfully!');
    router.refresh();
  };

  return (
    <Spin spinning={loading}>
      <div className="compare-app-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item className="link">
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              Compared Apps
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="compare-apps-list container">
        <h1>Compared Apps</h1>
        {Object.keys(comparedAppsSets).length === 0 ? (
          <Empty style={{ marginTop: '100px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          Object.keys(comparedAppsSets).map((path) => {
            const { app_host, app_compare } = comparedAppsSets[path];
            return (
              <div key={path} className="compare-section">
                <div className="app-container">
                  <div className="close-icon" onClick={() => removeComparison(path)}>
                    <CloseOutlined />
                  </div>
                  <Link href={path} className="app-list">
                    {/* Render app_host */}
                    {app_host && (
                      <div className="app-list-item">
                        <div className="app">
                          <div className="image">
                            <Link
                              href={`${BASE_URL}app/${app_host?.detail?.app_id}`}
                              target="_blank"
                              className="view-detail"
                            >
                              <Image src={app_host?.detail?.app_icon} width={90} height={90} alt="App Icon" />
                              {app_host?.detail.built_for_shopify === true && (
                                <div className="icon-bfs">
                                  <Tooltip
                                    title={
                                      app_host?.detail && app_host?.detail.rank_bfs > 0 ? app_host?.detail.rank_bfs : ''
                                    }
                                  >
                                    <Image
                                      src="/image/diamond.svg"
                                      alt="diamond"
                                      width={23}
                                      height={23}
                                      className="diamond-icon"
                                    />
                                  </Tooltip>
                                </div>
                              )}
                            </Link>
                          </div>
                          <div className="title-app">
                            <span className="app-name">{app_host?.app_name}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Render app_compare */}
                    {app_compare?.map((app) => (
                      <div key={app.detail?.app_id} className="app-list-item">
                        <div className="app">
                          <div className="image">
                            <Link href={`${BASE_URL}app/${app.detail?.app_id}`} target="_blank" className="view-detail">
                              <Image src={app.detail?.app_icon} width={90} height={90} alt="App Icon" />
                              {app?.detail.built_for_shopify === true && (
                                <div className="icon-bfs">
                                  <Tooltip title={app?.detail && app?.detail.rank_bfs > 0 ? app?.detail.rank_bfs : ''}>
                                    <Image
                                      src="/image/diamond.svg"
                                      alt="diamond"
                                      width={23}
                                      height={23}
                                      className="diamond-icon"
                                    />
                                  </Tooltip>
                                </div>
                              )}
                            </Link>
                          </div>
                          <div className="title-app">
                            <span className="app-name">{app?.app_name}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Spin>
  );
}
