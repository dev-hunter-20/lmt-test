'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { getParameterQuery } from '@/utils/functions';
import { Breadcrumb, Empty, message, Pagination, Select, Spin, Table, Tag } from 'antd';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import './CategoryCollectionDetail.scss';
import { optionsLanguage, optionsPricingtype, optionsSortBy, optionsSortType } from '@/utils/FilterOption';
import {
  ArrowLeftOutlined,
  DownOutlined,
  LinkOutlined,
  SketchOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import Image from 'next/image';

export default function CategoryCollectionDetail() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const isCategory = pathname.includes('category');
  const [data, setData] = useState();
  const [pricingRange, setPricingRange] = useState();
  const [avgPrice, setAvgPrice] = useState();
  const [dataCategory, setDataCategory] = useState();
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 24;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const [sort_by, setSort_by] = useState(params.sort_by ? params.sort_by : 'best_match');
  const [language, setLanguage] = useState(params.language ? params.language : 'uk');
  const [priceType, setPriceType] = useState(params.price_type ? params.price_type : 'all');
  const [sortType, setSortType] = useState(params.sort_type ? params.sort_type : 'rank');
  const [priceRange, setPriceRange] = useState(0);
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const id = lastPart;
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const fetchData = async (id, page, per_page, sort_by, language, sortType, priceType, priceRange) => {
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
      setPricingRange(result.filter_range_price);
      setAvgPrice(result.price_avg);
      setDataCategory(result.data.apps);
      setCurrentPage(result.current_page);
      setTotal(result.total);
    } else {
      message.error('Internal Server Error');
    }
  };

  useEffect(() => {
    fetchData(id, page, perPage, sort_by, language, sortType, priceType, priceRange);
  }, [language, page, priceType, sortType, sort_by, priceRange]);

  const checkLocale = () => {
    if (language === 'us') {
      return '';
    }
    if (language === 'cn') {
      return 'zh-CN';
    }
    if (language === 'tw') {
      return 'zh-TW';
    }
    return `${language}`;
  };

  const getLinkNameCategory = () => {
    if (id === 'built-for-shopify') {
      return `apps.shopify.com/app-groups/highlights/${id}?sort_by=${sort_by}&locale=${checkLocale(language)}`;
    }
    if (id === 'made-by-shopify') {
      return `apps.shopify.com/partners/shopify`;
    }
    return `apps.shopify.com/${isCategory ? 'categories' : 'collections'}/${id}?${
      language === 'uk' ? '' : `locale=${checkLocale(language)}&`
    }sort_by=${!isCategory && sort_by === 'popular' ? 'most_popular' : sort_by}`;
  };

  const renderSelect = (options, label, value, onChange) => {
    return (
      <div className="sort-container">
        <label className="select-label">{label}</label>
        <Select value={value} onChange={onChange} style={{ width: 150 }}>
          <Select.OptGroup label={label}>
            {options.map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select.OptGroup>
        </Select>
      </div>
    );
  };

  const handleChangeSort = (type, value) => {
    switch (type) {
      case 'sortBy':
        setSort_by(value);
        return;
      case 'sortType':
        setSortType(value);
        return;
      case 'language':
        setLanguage(value);
        return;
      case 'priceType':
        setPriceType(value);
        return;
      default:
        setPriceRange(value);
        return;
    }
  };

  const optionPricingRange = useMemo(() => {
    return pricingRange
      ? [
          { label: 'All', value: 0 },
          ...pricingRange.map((item, index) => {
            return { label: `$${item.min} - $${item.max}`, value: index + 1 };
          }),
        ]
      : [];
  }, [pricingRange]);

  const onChangePage = (page, per_page) => {
    fetchData(id, page, per_page, sort_by, language, sortType, priceType, priceRange);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const columns = [
    {
      title: '#',
      dataIndex: 'rank',
      key: 'rank',
      render: (rank, record) => (
        <div className="rank">
          <span>{record.index || rank}</span>
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
              src={record.app_icon}
              width={75}
              height={75}
              alt={name}
              onClick={() => router.push(`/app/${record.app_id}`)}
            />
          </div>
          <div className="item-detail-app">
            <div className="name-app-shopify">
              {record.before_rank && record.rank && record.before_rank - record.rank > 0 && (
                <span className="calular-incre">
                  <UpOutlined /> {record.before_rank - record.rank}{' '}
                </span>
              )}
              {record.before_rank && record.rank && record.before_rank - record.rank < 0 && (
                <span className="calular-decre">
                  <DownOutlined /> {record.rank - record.before_rank}{' '}
                </span>
              )}
              <Link href={`/app/${record.app_id}`} className="link-name">
                {name}
              </Link>
              {record.built_for_shopify && (
                <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                  Built for Shopify
                </Tag>
              )}
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
        </div>
      ),
      width: 350,
    },
    {
      title: 'Highlights',
      dataIndex: 'highlights',
      key: 'highlights',
      render: (highlights) => <ul>{highlights && highlights.map((item, index) => <li key={index}>{item}</li>)}</ul>,
      width: 200,
    },
    {
      title: 'Added at',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      showSorterTooltip: false,
      render: (created_at) => <span>{created_at ? created_at.slice(0, 10) : null}</span>,
      width: 120,
    },
    {
      title: 'Rating',
      dataIndex: 'star',
      key: 'star',
      sorter: (a, b) => a.star - b.star,
      showSorterTooltip: false,
      render: (star, record) => (
        <div className="icon-star">
          <StarFilled /> {star > 5 ? star / 10 : star}
          {record.before_star && record.star && record.before_star - record.star > 0 ? (
            <span className="calular-incre">
              <UpOutlined className="icon" /> {(record.before_star - record.star).toFixed(1)}
            </span>
          ) : record.before_star && record.star && record.before_star - record.star < 0 ? (
            <span className="calular-decre">
              <DownOutlined /> {(record.star - record.before_star).toFixed(1)}
            </span>
          ) : null}
        </div>
      ),
      width: 20,
    },
    {
      title: 'Reviews',
      dataIndex: 'review_count',
      key: 'review_count',
      sorter: (a, b) => a.review - b.review,
      showSorterTooltip: false,
      render: (review_count, record) => (
        <div>
          {review_count > 0 ? review_count : record.review || null}
          {record.before_review && record.review - record.before_review > 0 && (
            <span> (+{record.review - record.before_review})</span>
          )}
        </div>
      ),
      width: 100,
    },
  ];

  const dataTable = dataCategory?.map((item) => ({
    app_icon: item.app_icon,
    app_id: item.app_id,
    before_rank: item.before_rank,
    before_review: item.before_review,
    before_star: item.before_star,
    built_for_shopify: item.built_for_shopify,
    created_at: item.created_at,
    growth: item.growth,
    highlights: item.highlights,
    id: item.id,
    index: item.index,
    metatitle: item.metatitle,
    name: item.name,
    rank: item.rank,
    review: item.review,
    star: item.star,
    tagline: item.tagline,
  }));

  return (
    <Spin spinning={loading}>
      <div className="detail-categories">
        <div className="detail-categories-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />

                <Link prefetch={false} href={data ? `/${isCategory ? 'categories' : 'collections'}` : ''}>
                  {isCategory ? 'Categories' : 'Collections'}
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>{data && data.text ? data.text : ''}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        {data ? (
          <div className="detail-categories-body container">
            <div className="container-title-body">
              <div className="wrapper-title">
                <h1 className="title">{data && data.text ? data.text : ''}</h1>
                <div className="title-apps">
                  <span>{total}</span>&nbsp;apps - Average price:&nbsp;<span>${avgPrice}</span>/month
                </div>
                <div className="link">
                  <Link
                    href={`https://${getLinkNameCategory()}&utm_source=letsmetrix.com&utm_medium=${
                      isCategory ? 'category' : 'collection'
                    }&utm_content=${data && data.text ? data.text : ''}`}
                    target="_blank"
                    rel="noopener nofollow noreferrer"
                    prefetch={false}
                  >
                    {getLinkNameCategory()}
                  </Link>
                </div>
              </div>
              <div className="sort">
                {renderSelect(optionsSortBy, 'Sort By', sort_by, (value) => handleChangeSort('sortBy', value))}
                {renderSelect(optionsSortType, 'Sort Type', sortType, (value) => handleChangeSort('sortType', value))}
                {renderSelect(optionsPricingtype, 'Price Type', priceType, (value) =>
                  handleChangeSort('priceType', value),
                )}
                {renderSelect(optionPricingRange, 'Price Range', priceRange, (value) =>
                  handleChangeSort('priceRange', value),
                )}
                {renderSelect(optionsLanguage, 'Language', language, (value) => handleChangeSort('language', value))}
              </div>
            </div>

            <div className="detail-category">
              <Table
                columns={columns}
                dataSource={dataTable}
                pagination={false}
                bordered
                rowKey={id}
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
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </div>
    </Spin>
  );
}
