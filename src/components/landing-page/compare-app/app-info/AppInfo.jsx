'use client';

import React from 'react';
import './AppInfo.scss';
import { CheckOutlined, StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import { Table, Tooltip } from 'antd';
import { BASE_URL } from '@/common/constants';
import Link from 'next/link';

export default function AppInfo({ compareAppData }) {
  const transposedData = [
    {
      key: 'developer',
      title: 'Developer',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.partner.name ? (
          item.detail.partner.name
        ) : (
          <span key={`developer-${item.app_id}`} className="no-shopify">
            ...................
          </span>
        ),
      ),
    },
    {
      key: 'tagline',
      title: 'Tag Line',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.tagline ? (
          item.detail.tagline
        ) : (
          <span key={`tagline-${item.app_id}`} className="no-shopify">
            ...................
          </span>
        ),
      ),
    },
    {
      key: 'metadesc',
      title: 'Meta description',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.metadesc ? (
          item.detail.metadesc
        ) : (
          <span key={`metadesc-${item.app_id}`} className="no-shopify">
            ...................
          </span>
        ),
      ),
    },
    {
      key: 'shopifyBadges',
      title: 'Shopify Badges',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.built_for_shopify ? (
          <div className="shopify-badges" key={item.app_id}>
            <Image src="/image/diamond.svg" alt="diamond" width={20} height={20} className="diamond-icon" />
            <span>Built for Shopify</span>
          </div>
        ) : (
          <div className="no-shopify" key={item.app_id}>
            <span>...................</span>
          </div>
        ),
      ),
    },
    {
      key: 'date',
      title: 'Launch Date',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        return item.date ? (
          <span className="lauch-date">{item.date.split(' ')[0]}</span>
        ) : (
          <div className="no-shopify" key={item.app_id}>
            <span>...................</span>
          </div>
        );
      }),
    },
    {
      key: 'highlights',
      title: 'Highlights',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) =>
        item.detail.highlights ? (
          <ul key={item.app_id}>
            {item.detail.highlights.map((highlight, index) => (
              <li key={index} className="check">
                <CheckOutlined />
                {highlight}
              </li>
            ))}
          </ul>
        ) : (
          <span key={`no-highlights-${item.app_id}`} className="no-shopify">
            ...................
          </span>
        ),
      ),
    },
  ];

  const columns = [
    {
      title: 'Apps',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => {
      return {
        title: (
          <div className="app">
            <div className="image">
              <Image src={item.detail.app_icon} width={90} height={90} alt="Icon App" />
            </div>
            <div className="title-app">
              <Tooltip title={item.detail.name}>
                <span className="app-name">{item.detail.name}</span>
              </Tooltip>
              <div className="rating">
                <span className="star">
                  <StarFilled />
                  {item.detail.star}
                </span>
                <span>&nbsp;|&nbsp;</span>
                <Link prefetch={false} href={`${BASE_URL}app/${item.detail.app_id}/reviews`} className="review-count">
                  {item.detail.review_count} reviews
                </Link>
              </div>
              <Link
                href={`${BASE_URL}app/${item.detail.app_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-detail"
              >
                View Details
              </Link>
            </div>
          </div>
        ),
        dataIndex: `value${index}`,
        key: `value${index}`,
        width: 347,
      };
    }),
  ];

  const dataSource = transposedData.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });
  return (
    <div className="app-info">
      <Table dataSource={dataSource} columns={columns} pagination={false} scroll={{ x: 1500 }} className="table-app" />
    </div>
  );
}
