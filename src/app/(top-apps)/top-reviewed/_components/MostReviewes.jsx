'use client';

import React, { useState, useEffect } from 'react';
import { Table, Pagination, Spin, Tag } from 'antd';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { StarFilled, LinkOutlined, UpOutlined, DownOutlined, SketchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import './MostReviewes.scss';

function MostReviewes() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? parseInt(params.page, 10) : 1;
  const perPage = params.per_page ? parseInt(params.per_page, 10) : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    fetchData(page, perPage);
  }, []);

  const onChangePage = (page, pageSize) => {
    let newParams = {
      ...params,
      page,
      per_page: pageSize,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, pageSize);
    setCurrentPage(page);
    setNumberPage(pageSize);
  };

  async function fetchData(page, perPage) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getTopReview(page, perPage);
    if (result) {
      setData(
        result.result.map((item, index) => ({
          ...item.detail,
          rank: perPage * (page - 1) + index + 1,
          key: index,
        })),
      );
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record) => (
        <div className="rank">
          <span>{record.index || record.rank}</span>
        </div>
      ),
    },
    {
      title: 'App',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      showSorterTooltip: false,
      render: (text, record) => (
        <div className="content-app">
          <div className="image">
            <Image onClick={openAppDetail(record.app_id)} src={record.app_icon} width={75} height={75} alt="" />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank > 0 ? (
                <span className="calular-incre">
                  <UpOutlined /> {record.before_rank - record.rank}
                </span>
              ) : (
                ''
              )}
              {record.before_rank && record.rank && !isLoading && record.before_rank - record.rank < 0 ? (
                <span className="calular-decre">
                  <DownOutlined /> {record.rank - record.before_rank}
                </span>
              ) : (
                ''
              )}
              <Link prefetch={false} href={'/app/' + record.app_id} className="link-name">
                {record.name}
              </Link>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for shopify
                </Tag>
              )}
            </div>
            <div className="tagline">{record.tagline ? record.tagline : record.metatitle}</div>
            <div className="link-app-shopify">
              <Link
                target="_blank"
                href={
                  'https://apps.shopify.com/' +
                  record.app_id +
                  `?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.name}`
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
      ),
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights) =>
        highlights && highlights.length > 0 ? (
          <ul>
            {highlights.map((highlight, index) => (
              <li key={index}>{highlight}</li>
            ))}
          </ul>
        ) : null,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => a.star - b.star,
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {record.star > 5 ? record.star / 10 : record.star}
          {record.before_star && record.star && record.before_star - record.star > 0 ? (
            <span className="calular-incre">
              <UpOutlined className="icon" /> {(record.before_star - record.star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
          {record.before_star && record.star && record.before_star - record.star < 0 ? (
            <span className="calular-decre">
              <DownOutlined /> {(record.star - record.before_star).toFixed(1)}
            </span>
          ) : (
            ''
          )}
        </div>
      ),
      showSorterTooltip: false,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review_count - b.review_count,
      showSorterTooltip: false,
      render: (review_count, record) => (
        <>
          {record.review_count > 0 ? record.review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 ? (
            <span> (+{record.review - record.before_review})</span>
          ) : (
            ''
          )}
        </>
      ),
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="detail-top-reviewed">
        <div className="detail-top-reviewed-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top applications by Review</h1>
              <div className="title-apps">{total} apps</div>
            </div>
          </div>
          <div className="line-top"></div>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            rowClassName="item-detail"
            bordered
            scroll={{ x: 'max-content' }}
          />
          <div className="pagination">
            <Pagination
              pageSize={numberPage}
              current={currentPage}
              onChange={onChangePage}
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
            />
          </div>
        </div>
      </div>
    </Spin>
  );
}

export default MostReviewes;
