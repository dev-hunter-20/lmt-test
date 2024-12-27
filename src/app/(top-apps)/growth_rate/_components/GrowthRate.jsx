'use client';

import React, { useState, useEffect } from 'react';
import { Pagination, Spin, Row, Col, Table, Tag, Typography } from 'antd';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import Image from 'next/image';
import { FallOutlined, LinkOutlined, RiseOutlined, SketchOutlined, StarFilled } from '@ant-design/icons';
import Link from 'next/link';
import './GrowthRate.scss';

function GrowthRate() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();

  useEffect(() => {
    fetchData(page, perPage);
  }, []);

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, per_page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(page, per_page) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getGrowthRate(page, per_page);
    if (result) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const renderTagType = (sum) => {
    if (sum !== 0) {
      return (
        <Tag
          style={{
            borderRadius: '16px',
            color: sum > 0 ? '#336B1F' : '#ff3333',
            fontSize: '14px',
            padding: '5px 10px',
            fontWeight: 500,
          }}
          color={sum > 0 ? 'rgba(101, 216, 60, 0.36)' : '#ffb3b3'}
        >
          <Typography.Text>{sum}</Typography.Text>
          {sum > 0 ? <RiseOutlined /> : <FallOutlined />}
        </Tag>
      );
    }
    return null;
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (text, record, index) => (
        <div className="rank">
          <span>{perPage * (page - 1) + index + 1}</span>
        </div>
      ),
      width: 50,
    },
    {
      title: 'App',
      dataIndex: 'detail',
      key: 'name',
      sorter: (a, b) => (a.name || '').localeCompare(b.name || ''),
      render: (text, record) => {
        return (
          <div className="content-app">
            <div className="image">
              <Image onClick={() => openAppDetail(record.app_id)} src={record.app_icon} alt="" width={75} height={75} />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                <Link prefetch={false} href={'/app/' + record.app_id} className="link-name">
                  {record.name}
                </Link>
                {record.built_for_shopify && (
                  <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                    Built for Shopify
                  </Tag>
                )}
              </div>
              <div className="tagline">{record.tagline || record.metatitle}</div>
              <div className="link-app-shopify">
                <Link
                  href={`https://apps.shopify.com/${record.app_id}?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.name}`}
                  className="link"
                  target="__blank"
                  rel="noopener nofollow noreferrer"
                  prefetch={false}
                >
                  <LinkOutlined />
                </Link>
              </div>
            </div>
          </div>
        );
      },
      width: 350,
    },
    {
      title: 'Growth Rate',
      dataIndex: 'categoriesData',
      key: 'categoriesData',
      render: (text, record) => (
        <>
          {record.categoriesData.map((cat, index) => (
            <Row key={index} style={{ lineHeight: '30px' }}>
              <Col span={13}>
                <Link prefetch={false} href={`/category/${cat.category_id}`} target="__blank">
                  {cat.category_name}
                </Link>
              </Col>
              <Col
                span={4}
                style={{
                  color: cat.count > 0 ? '#336B1F' : '#ff3333',
                }}
              >
                {cat.count && cat.count > 0 ? '+' : ''}
                {cat.count}
              </Col>
            </Row>
          ))}
        </>
      ),
      width: 250,
    },
    {
      title: 'Total',
      dataIndex: 'countGrowthReview',
      key: 'countGrowthReview',
      sorter: (a, b) => a?.countGrowthReview - b?.countGrowthReview,
      render: (countGrowthReview) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          {renderTagType(countGrowthReview)}
        </div>
      ),
      width: 50,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => a?.star - b?.star,
      render: (star, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="icon-star">
            {record.star > 5 ? record.star / 10 : record.star} <StarFilled />
          </div>
        </div>
      ),
      width: 50,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review_count - b.review_count,
      render: (reviews, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>{record.review_count > 0 ? record.review_count : null}</div>
        </div>
      ),
      width: 50,
    },
  ];

  const dataSource = data.map((item, index) => {
    const { app_id, name, app_icon, tagline, metatitle, review_count, star, built_for_shopify } = item.detail;
    const categoriesData = item.categories
      .filter((item) => item.count)
      .map((cat, index) => {
        return {
          key: index,
          category_id: cat.category_id,
          category_name: cat.category_name,
          count: cat.count,
        };
      });
    const countGrowthReview = item.count;
    return {
      key: index,
      app_id,
      name,
      app_icon,
      tagline,
      metatitle,
      built_for_shopify: built_for_shopify,
      star,
      review_count: review_count,
      categoriesData: categoriesData,
      countGrowthReview: countGrowthReview,
    };
  });

  return (
    <Spin spinning={isLoading}>
      <div className="detail-top-growth-rate">
        <div className="detail-top-growth-rate-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top applications by Growth Rate</h1>
              <div className="title-apps">{total} apps</div>
            </div>
          </div>
          <div className="detail-category">
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={false}
              rowClassName="item-detail"
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
export default GrowthRate;
