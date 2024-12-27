'use client';

import React from 'react';
import './PopularComparisons.scss';
import { Col, Empty, Row, Tooltip } from 'antd';
import Link from 'next/link';
import Image from 'next/image';
import { SwapOutlined } from '@ant-design/icons';

export default function PopularComparisons({ compareAppData }) {
  const recommendedDataAppCompare = compareAppData[1].app_compare.map((item) => {
    if (!item.categories) return [];

    return item.categories.flatMap((cate) => {
      if (!cate.top_3_apps) return [];

      return cate.top_3_apps
        .map((top) => {
          if (top && top.detail) {
            return {
              app_id: top.app_id,
              app_icon: top.detail.app_icon,
              app_name: top.detail.name,
            };
          }
          return null;
        })
        .filter((app) => app !== null);
    });
  });

  const recommendedAppHost = {
    app_id: compareAppData[0].app_host.app_id,
    app_name: compareAppData[0].app_host.app_name,
    app_icon: compareAppData[0].app_host.detail?.app_icon || '',
  };

  const dataPopularComparisonsRender = () => {
    const seenAppIds = new Set();
    let filteredApps = recommendedDataAppCompare.flat().filter((compareApp) => {
      if (!seenAppIds.has(compareApp.app_id) && compareApp.app_id !== recommendedAppHost.app_id) {
        seenAppIds.add(compareApp.app_id);
        return true;
      }
      return false;
    });

    if (filteredApps.length === 0) {
      return (
        <div className="no-data-popular">
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        </div>
      );
    }

    const numItemsToShow = filteredApps.length >= 9 ? 9 : filteredApps.length >= 6 ? 6 : 3;
    const appsToShow = filteredApps.slice(0, numItemsToShow);

    return (
      <Row>
        {appsToShow.map((compareApp, index) => {
          const appNames = [recommendedAppHost.app_id, compareApp.app_id];
          appNames.sort((a, b) => a.localeCompare(b));
          const compareUrl = `/app/${appNames[0]}/compare-app/vs/${appNames[1]}`;

          return (
            <Col key={index}>
              <div className="item-compare">
                <Tooltip title={recommendedAppHost.app_name}>
                  <Link href={`/app/${recommendedAppHost.app_id}`}>
                    <Image
                      src={recommendedAppHost.app_icon}
                      width={100}
                      height={100}
                      alt={recommendedAppHost.app_name}
                      className="image-app"
                    />
                  </Link>
                </Tooltip>
                <Tooltip title="Compare">
                  <Link href={compareUrl}>
                    <SwapOutlined className="icon-compare" />
                  </Link>
                </Tooltip>
                <Tooltip title={compareApp.app_name}>
                  <Link href={`/app/${compareApp.app_id}`}>
                    <Image
                      src={compareApp.app_icon}
                      width={100}
                      height={100}
                      alt={compareApp.app_name}
                      onClick={() => handleAppDetailClick(compareApp.app_id)}
                      className="image-app"
                    />
                  </Link>
                </Tooltip>
              </div>
            </Col>
          );
        })}
      </Row>
    );
  };
  return (
    <div className="popular-comparisons">
      <div className="content">{dataPopularComparisonsRender()}</div>
    </div>
  );
}
