'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Spin, Pagination, Breadcrumb, Tabs, Button } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import Link from 'next/link';
import ItemDetail from '@/components/item-detail/ItemDetail';
import './SearchDetail.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function SearchDetail() {
  const [data, setData] = useState({
    apps: [],
    partners: [],
    categories: [],
    collections: [],
  });
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState({
    totalApps: 0,
    totalPartners: 0,
    totalCategories: 0,
    totalCollections: 0,
  });
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [total, setTotal] = useState(0);
  const pageSizeOptions = useRef([20, 40, 60, 100]);
  const searchParams = useSearchParams();
  const paramSearch = searchParams.get('q');
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchSearchData(paramSearch, page, perPage);
  }, [paramSearch, page, perPage]);

  const fetchSearchData = async (query, page, perPage) => {
    setLoading(true);
    try {
      const result = await SearchDataApiService.searchDataHome(query, page, perPage);
      if (result && result.code === 0) {
        setData({
          apps: result.data.apps,
          partners: result.data.partners,
          categories: result.data.categories,
          collections: result.data.collections,
        });
        setCounts({
          totalApps: result.data.apps.length,
          totalPartners: result.data.partners.length,
          totalCategories: result.data.categories.length,
          totalCollections: result.data.collections.length,
        });
        setTotal(result.total);
      } else {
        console.error('Error fetching search data: Invalid response from API');
      }
    } catch (error) {
      console.error('Error fetching search data:', error);
    }
    setLoading(false);
  };

  const renderSection = (title, data, renderFunction, showDivider = true) =>
    data.length > 0 && (
      <>
        <div className="title">{title}</div>
        {renderFunction()}
        {showDivider && <hr style={{ border: '1px solid #e0e0e0', margin: '20px 0' }} />}
      </>
    );

  const renderApps = () => (
    <div className="list-item">
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        {data.apps.map((item) => (
          <Col style={{ marginTop: '15px' }} lg={8} xs={12} md={12} key={item.app_id}>
            <ItemDetail value={item} data={data} />
          </Col>
        ))}
      </Row>
      {counts.totalApps > 0 && (
        <div className="pagination">
          <Pagination
            pageSize={perPage}
            current={page}
            onChange={(pageNumber) => {
              setPage(pageNumber);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            total={total}
            pageSizeOptions={pageSizeOptions.current}
            onShowSizeChange={(current, size) => {
              setPerPage(size);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );

  const renderDevelopers = () => (
    <div className="content-item">
      <Row gutter={[32, 32]} className="gutter-column">
        {data.partners.map((item) => (
          <Col span={8} key={item.id}>
            <div className="developer-item">
              <Link prefetch={false} href={`/developer/${item.id}/apps`} className="text">
                {item.name}
              </Link>
              <Link prefetch={false} href={`/developer/${item.id}/apps`} className="see-details">
                See Details
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderCategories = () => (
    <div className="content-item">
      <Row gutter={[32, 32]} className="gutter-column">
        {data.categories.map((item) => (
          <Col span={8} key={item.slug}>
            <div className="developer-item">
              <Link prefetch={false} href={`/category/${item.slug}/apps`} className="text">
                {item.text}
              </Link>
              <Link prefetch={false} href={`/category/${item.slug}/apps`} className="see-details">
                See Details
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  const renderCollections = () => (
    <div className="content-item">
      <Row gutter={[32, 32]} className="gutter-column">
        {data.collections.map((item) => (
          <Col span={8} key={item.slug}>
            <div className="developer-item">
              <Link prefetch={false} href={`/collection/${item.slug}/apps`} className="text">
                {item.text}
              </Link>
              <Link prefetch={false} href={`/collection/${item.slug}/apps`} className="see-details">
                See Details
              </Link>
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );

  return (
    <Spin spinning={loading}>
      <div className="detail-search-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              Search
            </Breadcrumb.Item>
            <Breadcrumb.Item>{paramSearch}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="search-shopify container">
        <div className="list-search-detail">
          <div className="info-search-detail">
            <div className="title-name">Search</div>
            <div className="content-search">
              <span>You searched for "{paramSearch}"</span>
            </div>
          </div>
          <div className="body-search-detail">
            <Tabs defaultActiveKey="all" size="middle">
              <Tabs.TabPane
                tab={`All (${
                  counts.totalApps + counts.totalPartners + counts.totalCategories + counts.totalCollections
                })`}
                key="all"
              >
                {renderSection('Apps', data.apps, renderApps)}
                {renderSection('Developers', data.partners, renderDevelopers)}
                {renderSection('Categories', data.categories, renderCategories)}
                {renderSection('Collections', data.collections, renderCollections, false)}
              </Tabs.TabPane>
              {counts.totalApps > 0 && (
                <Tabs.TabPane tab={`Apps (${counts.totalApps})`} key="apps">
                  {renderApps()}
                </Tabs.TabPane>
              )}
              {counts.totalPartners > 0 && (
                <Tabs.TabPane tab={`Developers (${counts.totalPartners})`} key="developers">
                  {renderDevelopers()}
                </Tabs.TabPane>
              )}
              {counts.totalCategories > 0 && (
                <Tabs.TabPane tab={`Categories (${counts.totalCategories})`} key="categories">
                  {renderCategories()}
                </Tabs.TabPane>
              )}
              {counts.totalCollections > 0 && (
                <Tabs.TabPane tab={`Collections (${counts.totalCollections})`} key="collections">
                  {renderCollections()}
                </Tabs.TabPane>
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </Spin>
  );
}
