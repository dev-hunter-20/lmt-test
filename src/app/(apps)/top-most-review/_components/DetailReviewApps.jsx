'use client';

import { Breadcrumb, Pagination, Spin, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  DownOutlined,
  LinkOutlined,
  SketchOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import './DetailReviewApps.scss';
import Link from 'next/link';
import Image from 'next/image';

export default function DetailReviewApps() {
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 24;
  const [total, setTotal] = useState();
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [loading, setLoading] = useState(false);
  const [listApp, setListApp] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    router.back();
  };

  const asyncFetch = async (page, per_page) => {
    setLoading(true);
    const result = await DashboardApiService.getAppsMostReview(page, per_page);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      setLoading(false);
    }
  };

  useEffect(() => {
    const newQueryParams = {
      ...params,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page: page,
      per_page: per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record, index) => (
        <div className="rank">
          <span>{perPage * (currentPage - 1) + index + 1}</span>
        </div>
      ),
      width: 20,
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
      render: (name, record) => (
        <div className="content-app">
          <div className="image">
            <Image
              src={record.detail.app_icon}
              width={75}
              height={75}
              alt={name}
              onClick={() => router.push(`/app/${record.detail.app_id}`)}
            />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.detail.before_rank &&
                record.detail.rank &&
                record.detail.before_rank - record.detail.rank > 0 && (
                  <span className="calular-incre">
                    <UpOutlined /> {record.detail.before_rank - record.detail.rank}{' '}
                  </span>
                )}
              {record.detail.before_rank &&
                record.detail.rank &&
                record.detail.before_rank - record.detail.rank < 0 && (
                  <span className="calular-decre">
                    <DownOutlined /> {record.detail.rank - record.detail.before_rank}{' '}
                  </span>
                )}
              <Link href={`/app/${record.detail.app_id}`} className="link-name">
                {name}
              </Link>
              {record.detail.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for Shopify
                </Tag>
              )}
              <div className="tagline">{record.detail.tagline ? record.detail.tagline : record.detail.metatitle}</div>
              <div className="link-app-shopify">
                <Link
                  target="_blank"
                  href={
                    'https://apps.shopify.com/' +
                    record.detail.app_id +
                    `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.detail.name}`
                  }
                  className="link"
                  rel="noopener nofollow noreferrer"
                  prefetch={false}
                >
                  <LinkOutlined />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ),
      width: 350,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (text, record) => {
        const highlightDetail = record.detail;
        return (
          <ul>
            {highlightDetail?.highlights?.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        );
      },
      width: 200,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => {
        const starA = a.detail.star > 5 ? a.detail.star / 10 : a.detail.star;
        const starB = b.detail.star > 5 ? b.detail.star / 10 : b.detail.star;
        return starA - starB;
      },
      showSorterTooltip: false,
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {record.detail.star > 5 ? record.detail.star / 10 : record.detail.star}
        </div>
      ),
      width: 20,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review_count - b.review_count,
      showSorterTooltip: false,
      render: (review_count, record) => (review_count > 0 ? review_count : record.review || null),
      width: 100,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item style={{ color: 'white' }}>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                <Link prefetch={false} href="/dashboard">
                  Apps Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: 'white' }}>Top Most Review</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top apps has the most reviews</h1>
              <div className="title-apps">{total} apps</div>
            </div>
          </div>
          <div className="detail-category">
            <Table
              rowKey="_id"
              columns={columns}
              dataSource={listApp}
              pagination={false}
              bordered
              scroll={{ x: 'max-content' }}
            />
          </div>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setNumberPage(pageSize);
                  onChangePage(page, pageSize);
                }}
                total={total}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
                pageSizeOptions={[24, 48, 96, 192].map(String)}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Spin>
  );
}
