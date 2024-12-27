'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { Breadcrumb, Col, Empty, Pagination, Row, Spin } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ItemDetail from '../item-detail/ItemDetail';
import './CategoryCollectionCompare.scss';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function CategoryCollectionCompare() {
  const pathname = usePathname();
  const isCategory = pathname.includes('category');
  const [data, setData] = useState([]);
  const page = 1;
  const per_page = 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(per_page);
  const [total, setTotal] = useState();
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 2];
  const id = lastPart;
  const [loading, setLoading] = useState(false);
  const [sort_by, setSort_by] = useState('best_match');
  const [language, setLanguage] = useState('uk');
  const [priceType, setPriceType] = useState('all');
  const [sortType, setSortType] = useState('rank');
  const [priceRange, setPriceRange] = useState('all');
  const [pricingRange, setPricingRange] = useState();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const asyncFetch = async (id, page, per_page, sort_by, language, sortType, priceType, priceRange) => {
    setLoading(true);
    const range = pricingRange ? pricingRange.find((item, index) => index + 1 == priceRange) : {};
    const rangeMax = range ? range.max : 0;
    const rangeMin = range ? range.min : 0;
    let result = isCategory
      ? await CategoriesApiService.getConversationCategory(
          id,
          sort_by,
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        )
      : await CategoriesApiService.getConversationCollection(
          id,
          sort_by === 'popular' ? 'most_popular' : 'best_match',
          page,
          per_page,
          language,
          sortType,
          priceType,
          rangeMin,
          rangeMax,
        );
    setLoading(false);
    if (result && result.code == 0) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } else {
      message.error('Internal Server Error');
    }
  };

  useEffect(() => {
    asyncFetch(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
  }, []);

  const onChangePage = (page, per_page) => {
    asyncFetch(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              {isCategory ? 'Category' : 'Collection'}
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">{data ? data.text : ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      {data?.apps ? (
        <div className="developer-detail container">
          <div className="list-developer-detail">
            <div className="info-developer-detail">
              <div>
                <h1 className="title-name">{data ? data.text : ''} </h1>
                <div className="amount-app">
                  <span>{total} apps</span>
                </div>
                <div className="link">
                  <Link
                    target="_blank"
                    href={`https://apps.shopify.com/partners/${id}?utm_source=letsmetrix.com&utm_medium=developer&utm_content=${
                      data ? data.text : ''
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
                          <ItemDetail value={item} />
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
