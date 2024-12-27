'use client';

import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import ItemDetail from '@/components/item-detail/ItemDetail';
import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { Breadcrumb, Col, Empty, Pagination, Row, Spin } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import './DeveloperDetailApps.scss';

export default function DeveloperDetailApps() {
  const pathname = usePathname();
  const [data, setData] = useState([]);
  const page = 1;
  const per_page = 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(per_page);
  const [total, setTotal] = useState();
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 2];
  const id = lastPart;
  const [selectValue, setSelectValue] = useState('review');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    asyncFetch(id, page, per_page);
  }, []);

  const asyncFetch = async (id, page, per_page, selectValue) => {
    setLoading(true);
    let result = await DashboardDeveloperApiService.getDetailDeveloper(id, page, per_page, selectValue);
    if (result) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setLoading(false);
  };

  const onChangePage = (page, per_page) => {
    asyncFetch(id, page, per_page, selectValue);
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              Developer
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">{data ? data.name : ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      {data?.apps ? (
        <div className="developer-detail container">
          <div className="list-developer-detail">
            <div className="info-developer-detail">
              <div>
                <h1 className="title-name">{data ? data.name : ''} </h1>
                <div className="amount-app">
                  <span>{total} apps</span>
                  <p>
                    <StarFilled className="icon-star" /> {data.avg_star} / {data.review_count} reviews
                  </p>
                </div>
                <div className="link">
                  <Link
                    target="_blank"
                    href={`https://apps.shopify.com/partners/${id}?utm_source=letsmetrix.com&utm_medium=developer&utm_content=${
                      data ? data.name : ''
                    }`}
                    rel="noopener nofollow noreferrer"
                    prefetch={false}
                  >
                    {`apps.shopify.com/partners/${id}`}
                  </Link>
                </div>
              </div>
            </div>
            <div className="body-developer-detail">
              <div className="list-item">
                {data?.apps && data?.apps.length > 0 ? (
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    {data.apps.map((item, index) => (
                      <Col style={{ marginTop: '15px' }} className="gutter-row" lg={8} xs={12} md={12} key={index}>
                        <ItemDetail value={item} dataDeveloper={data.apps} />
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Empty />
                )}
              </div>
            </div>
          </div>
          {total > 0 ? (
            <div className="pagination flex justify-center">
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
      ) : (
        <Empty />
      )}
    </Spin>
  );
}
