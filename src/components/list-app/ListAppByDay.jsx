'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Pagination, Select, Spin, Table, Tag, message } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import './ListAppByDay.scss';
import {
  ArrowLeftOutlined,
  DownOutlined,
  LinkOutlined,
  SketchOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import Image from 'next/image';

const { Option } = Select;

export default function ListAppByDay() {
  const params = getParameterQuery();
  const view_type = params.type;
  const date = params.date;
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'newest');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [listApp, setListApp] = useState([]);
  const pathname = usePathname();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);

  const handleBack = () => {
    router.back();
  };

  const handleChangeSortBy = (value) => {
    setSort_by(value);
    const newQueryParams = {
      ...params,
      page: 1,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
  };

  const asyncFetch = async (type, date, page, per_page) => {
    setLoading(true);
    const result =
      view_type == 'bfs'
        ? await DashboardApiService.getBFSByDate(date, type, page, per_page)
        : await DashboardApiService.getAppsByDate(type, date, page, per_page);
    setLoading(false);
    if (result && result.code == 0) {
      setListApp(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
      return;
    }
    message.error(result.message);
  };

  useEffect(() => {
    const newQueryParams = {
      ...params,
      sort_by,
    };
    router.push(`${pathname}?${encodeQueryParams(newQueryParams)}`);
    asyncFetch(sort_by, date, page, perPage);
  }, [sort_by]);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(sort_by, date, page, perPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const arrFilter = useMemo(() => {
    if (view_type == 'bfs') {
      return [
        { value: 'active', label: 'Built For Shopify' },
        { value: 'inactive', label: 'Removed' },
      ];
    }
    return [
      { value: 'newest', label: 'Newest' },
      { value: 'delete', label: 'Deleted' },
      { value: 'unlisted', label: 'Delisted' },
    ];
  }, [view_type]);

  const isAppInfo = (record, param) => {
    return record?.detail?.[param] ? record.detail[param] : record?.app_info?.detail?.[param];
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
      sorter: (a, b) => {
        const nameA = isAppInfo(a, 'name')?.toLowerCase() || '';
        const nameB = isAppInfo(b, 'name')?.toLowerCase() || '';
        return nameA.localeCompare(nameB);
      },
      showSorterTooltip: false,
      render: (name, record) => {
        return (
          <div className="content-app">
            <div className="image">
              <Image
                src={isAppInfo(record, 'app_icon')}
                width={75}
                height={75}
                alt={name}
                onClick={() => router.push(`/app/${isAppInfo(record, 'app_id')}`)}
              />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                {isAppInfo(record, 'before_rank') &&
                  isAppInfo(record, 'rank') &&
                  isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank') > 0 && (
                    <span className="calular-incre">
                      <UpOutlined /> {isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank')}{' '}
                    </span>
                  )}
                {isAppInfo(record, 'before_rank') &&
                  isAppInfo(record, 'rank') &&
                  isAppInfo(record, 'before_rank') - isAppInfo(record, 'rank') < 0 && (
                    <span className="calular-decre">
                      <DownOutlined /> {isAppInfo(record, 'rank') - isAppInfo(record, 'before_rank')}{' '}
                    </span>
                  )}
                <Link href={`/app/${isAppInfo(record, 'app_id')}`} className="link-name">
                  {name}
                </Link>
                {isAppInfo(record, 'built_for_shopify') && (
                  <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                    Built for Shopify
                  </Tag>
                )}
                <div className="tagline">
                  {isAppInfo(record, 'tagline') ? isAppInfo(record, 'tagline') : isAppInfo(record, 'metatitle')}
                </div>
                <div className="link-app-shopify">
                  <Link
                    target="_blank"
                    href={
                      'https://apps.shopify.com/' +
                      isAppInfo(record, 'app_id') +
                      `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${isAppInfo(record, 'name')}`
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
        );
      },
      width: 350,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (text, record) => {
        const highlightDetail = record.detail || record.app_info?.detail;
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
        const starA = isAppInfo(a, 'star') || 0;
        const starB = isAppInfo(b, 'star') || 0;
        const normalizedStarA = starA > 5 ? starA / 10 : starA;
        const normalizedStarB = starB > 5 ? starB / 10 : starB;
        return normalizedStarA - normalizedStarB;
      },
      showSorterTooltip: false,
      render: (star, record) => {
        const starValue = isAppInfo(record, 'star') || 0;
        return (
          <div className="icon-star">
            <StarFilled /> {starValue > 5 ? starValue / 10 : starValue}
          </div>
        );
      },
      width: 20,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => {
        const reviewCountA = isAppInfo(a, 'review_count') || 0;
        const reviewCountB = isAppInfo(b, 'review_count') || 0;
        return reviewCountA - reviewCountB;
      },
      showSorterTooltip: false,
      render: (review_count, record) =>
        isAppInfo(record, 'review_count') > 0 ? isAppInfo(record, 'review_count') : isAppInfo(record, 'review') || null,
      width: 100,
    },
  ];

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                <Link prefetch={false} href="/dashboard">
                  Apps Dashboard
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{view_type === 'bfs' ? 'Built For Shopify' : 'List Apps'}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">{date}</h1>
              <div className="title-apps">{total} apps</div>
            </div>
            <div className="sort">
              Type:
              <Select value={sort_by} onChange={handleChangeSortBy}>
                {arrFilter.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
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

          {listApp.length > 0 && (
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
              />
            </div>
          )}
        </div>
      </div>
    </Spin>
  );
}
