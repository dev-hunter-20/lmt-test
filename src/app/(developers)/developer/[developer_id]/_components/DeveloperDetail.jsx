'use client';

import React, { useState, useEffect, useRef } from 'react';
import './DeveloperDetail.scss';
import { Row, Col, Spin, Empty, Breadcrumb } from 'antd';
import { Pagination, Select } from 'antd';
import ItemDetailDeveloper from './ItemDetailDeveloper';
import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import Link from 'next/link';

const { Option } = Select;

function DeveloperDetail() {
  const pathname = usePathname();
  const [data, setData] = useState([]);

  const page = 1;
  const per_page = 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(per_page);
  const [total, setTotal] = useState();

  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const [selectValue, setSelectValue] = useState('review');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    asyncFetch(id, page, per_page, selectValue);
  }, [selectValue]);

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

  const handleSelectChange = (value) => {
    setSelectValue(value);
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
              <Link prefetch={false} href={'/developers'}>
                Developers Dashboard
              </Link>
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
              <div>
                <label>Sort:</label>
                <Select className="sort-developer-detail" value={selectValue} onChange={handleSelectChange}>
                  <Option value="review">Review</Option>
                  <Option value="first launched">First launched</Option>
                </Select>
              </div>
            </div>
            <div className="body-developer-detail">
              <div className="list-item">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {data?.apps &&
                    data?.apps.map((item, index) => {
                      return (
                        <Col
                          style={{ marginTop: '15px' }}
                          className="gutter-row"
                          lg={8}
                          xs={12}
                          md={12}
                          key={'' + index}
                        >
                          <ItemDetailDeveloper value={item} />
                        </Col>
                      );
                    })}
                </Row>
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

export default DeveloperDetail;
