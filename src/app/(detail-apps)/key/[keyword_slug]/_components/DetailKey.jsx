'use client';

import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { encodeQueryParams, getParameterQuery, renderFilterDropdown } from '@/utils/functions';
import { Breadcrumb, Col, Menu, Pagination, Row, Spin, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import {
  StarFilled,
  UpOutlined,
  DownOutlined,
  LinkOutlined,
  ArrowUpOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { optionsLanguage, optionsSortBy } from '@/utils/FilterOption';
import './DetailKey.scss';

export default function DetailKey() {
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const [sort_by, setSort_by] = useState('best_match');
  const [sort_type, setSort_type] = useState('rank');
  const [dataKey, setDataKey] = useState();
  const [data, setData] = useState();
  const [language, setLanguage] = useState('uk');
  const [isLoading, setIsLoading] = useState(false);
  const fromDate = '';
  const toDate = '';
  const router = useRouter();
  const pathname = usePathname();
  const id = pathname.slice(5);

  const handleBack = () => {
    router.back();
  };

  const asyncFetch = async (id, page, perPage, sort_by, sort_type, language, fromDate, toDate) => {
    setIsLoading(true);
    let result;
    result = await DetailAppApiService.getKeywordByLanguage(
      id,
      page,
      perPage,
      sort_by,
      sort_type,
      language,
      fromDate,
      toDate,
    );
    setIsLoading(false);
    if (result.code === 102) {
      message.error('No data');
      return;
    }
    if (result && result.code !== 102) {
      setData({
        ...result.data,
        text: result.data.text ? result.data.text : data.text,
      });
      if (result.data) {
        setDataKey(result.data.apps);
      }
      setCurrentPage(result.current_page);
      setTotal(result.total);
    }
  };

  useEffect(() => {
    asyncFetch(id, page, perPage, sort_by, sort_type, language, fromDate, toDate);
  }, [page, sort_by, sort_type, language]);

  const checkLocale = () => {
    if (language === 'uk') {
      return '';
    }
    if (language === 'cn') {
      return 'locale=zh-CN&';
    }
    if (language === 'tw') {
      return 'locale=zh-TW&';
    }
    return `locale=${language}&`;
  };
  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const getLinkNameKey = (keyword) => {
    return `apps.shopify.com/search?${checkLocale()}q=` + keyword;
  };

  const handleChangeSort = (type, value) => {
    if (type == 'sortBy') {
      setSort_by(value);
      return;
    }
    if (type == 'language') {
      setLanguage(value);
      return;
    }
    setSort_type(value);
  };

  const renderOption = (options, type) => {
    return (
      <Menu>
        {options.map((item, index) => (
          <Menu.Item key={index} onClick={() => handleChangeSort(type, item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  const optionsSortType = [
    { label: 'Rank', value: 'rank' },
    { label: 'Review', value: 'review' },
    { label: 'Star', value: 'star' },
  ];

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page: page,
      per_page: per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(id, page, per_page, sort_by, sort_type, language, fromDate, toDate);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="detail-keys">
        <div className="detail-key-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item style={{ color: 'white' }}>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                Keys
              </Breadcrumb.Item>
              <Breadcrumb.Item style={{ color: 'white' }}>{data && data.text ? data.text : ''}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-key-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <div className="title">{data && data.text ? data.text : ''}</div>
              <div className="title-apps">{total} apps</div>
              <div className="link">
                <Link
                  target="_blank"
                  href={
                    `https://apps.shopify.com/search?${checkLocale()}q=` +
                    encodeURIComponent(data && data.text ? data.text : '').replace(/%20/g, '+') +
                    '&sort_by=' +
                    sort_by +
                    `&utm_source=letsmetrix.com&utm_medium=keyword&utm_content=${data && data.text ? data.text : ''}`
                  }
                  rel="noopener nofollow noreferrer"
                  prefetch={false}
                >
                  {getLinkNameKey(data && data.text ? data.text + '&sort_by=' + sort_by : '')}
                </Link>
              </div>
            </div>
            <div className="sort_by">
              {renderFilterDropdown(
                renderOption(optionsSortBy, 'sortBy'),
                'Sort By',
                sort_by === 'popular' ? 'Popular' : 'Best Match',
              )}
              {renderFilterDropdown(
                renderOption(optionsSortType, 'sortType'),
                'Sort Type',
                optionsSortType.find((item) => item.value === sort_type).label,
              )}
              {renderFilterDropdown(
                renderOption(optionsLanguage, 'language'),
                'Language',
                optionsLanguage.find((item) => item.value === language).label,
              )}
            </div>
          </div>
          <div className="line-top"></div>
          <div className="detail-key">
            <div className="title-column">
              <Row>
                <Col className="title-styled" span={2}>
                  #
                </Col>
                <Col className="title-styled" span={16}>
                  App
                </Col>
                <Col className="title-styled" span={3}>
                  Rating
                </Col>
                <Col className="title-styled" span={3}>
                  Reviews
                </Col>
              </Row>
            </div>

            {dataKey
              ? dataKey.map((itemChild, index) => {
                  return (
                    <div className="item-detail" key={index}>
                      <Row>
                        <Col span={2}>
                          <div className="rank">
                            <span>{itemChild.index || itemChild.rank}</span>
                          </div>
                        </Col>
                        <Col span={15}>
                          <div className="content-app">
                            <div className="image">
                              <Image
                                onClick={openAppDetail(itemChild.app_id)}
                                src={itemChild.app_icon}
                                width={75}
                                height={75}
                                alt=""
                              />
                            </div>
                            <div className="item-detail-app">
                              <div className="name-app-shopify">
                                {sort_type !== 'growth' && (
                                  <>
                                    {itemChild.before_rank &&
                                    itemChild.rank &&
                                    itemChild.before_rank - itemChild.rank > 0 ? (
                                      <span className="calular-incre">
                                        <UpOutlined /> {itemChild.before_rank - itemChild.rank}{' '}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                    {itemChild.before_rank &&
                                    itemChild.rank &&
                                    itemChild.before_rank - itemChild.rank < 0 ? (
                                      <span className="calular-decre">
                                        <DownOutlined /> {itemChild.rank - itemChild.before_rank}{' '}
                                      </span>
                                    ) : (
                                      ''
                                    )}
                                  </>
                                )}

                                <Link prefetch={false} href={'/app/' + itemChild.app_id} className="link-name">
                                  {itemChild.name}
                                </Link>
                              </div>
                              <div className="tagline">{itemChild.tagline}</div>
                              <div className="link-app-shopify">
                                <Link
                                  target="_blank"
                                  href={
                                    'https://apps.shopify.com/' +
                                    itemChild.app_id +
                                    `?&utm_source=letsmetrix.com&utm_medium=keyword&utm_content=${itemChild.name}`
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
                        </Col>
                        <Col span={3} className="flex items-center justify-center">
                          <div className="icon-star">
                            <StarFilled /> {itemChild.star > 5 ? itemChild.star / 10 : itemChild.star}
                            {itemChild.before_star && itemChild.star && itemChild.star - itemChild.before_star > 0 ? (
                              <span className="calular-incre">
                                {' '}
                                <UpOutlined className="icon" /> {(itemChild.star - itemChild.before_star).toFixed(1)}{' '}
                              </span>
                            ) : (
                              ''
                            )}
                            {itemChild.before_star && itemChild.star && itemChild.star - itemChild.before_star < 0 ? (
                              <span className="calular-decre">
                                {' '}
                                <DownOutlined /> {(itemChild.before_star - itemChild.star).toFixed(1)}{' '}
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </Col>
                        <Col span={3} className="flex items-center justify-center">
                          <div>
                            {itemChild.review}
                            {itemChild.growth && itemChild.growth > 0 ? (
                              <span style={{ color: '#339933' }}>
                                {' '}
                                ( +{itemChild.growth} <ArrowUpOutlined />)
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              : ''}
          </div>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(pageNumber, pageSize) => {
                  setCurrentPage(pageNumber);
                  setNumberPage(pageSize);
                  onChangePage(pageNumber, pageSize);
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
