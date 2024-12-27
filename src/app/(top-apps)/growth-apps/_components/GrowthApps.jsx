'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Pagination,
  Spin,
  Row,
  Col,
  DatePicker,
  Button,
  Select,
  TreeSelect,
  Tag,
  Table,
  Typography,
  Breadcrumb,
} from 'antd';
import { encodeQueryParams, getParameterQuery } from '@/utils/functions';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import dayjs from 'dayjs';
import {
  ArrowLeftOutlined,
  DownOutlined,
  FallOutlined,
  LinkOutlined,
  RiseOutlined,
  SearchOutlined,
  SketchOutlined,
  StarFilled,
  UpOutlined,
} from '@ant-design/icons';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './GrowthApps.scss';

const { RangePicker } = DatePicker;

export default function GrowthApps() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const dateFormat = 'YYYY-MM-DD';
  const start_date = useRef(dayjs().subtract(30, 'd').format(dateFormat));
  const end_date = useRef(dayjs().format(dateFormat));
  const [isBFS, setIsBFS] = useState(false);
  const [periodReview, setPeriodReview] = useState(0);
  const [initialData, setInitialData] = useState(null);
  const [valueFilter, setValueFilter] = useState('');
  const [isActiveBFS, setIsActiveBFS] = useState(false);
  const router = useRouter();

  const openAppDetail = (id) => () => {
    router.push(`/app/${id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const formatCategoriesToTreeData = (categories) => {
    return categories.map((category) => ({
      title: category.text,
      value: category._id,
      children: category.child ? formatCategoriesToTreeData(category.child) : [],
    }));
  };

  useEffect(() => {
    fetchData(page, perPage, start_date.current, end_date.current);
    fectDataCateAll();
  }, []);

  const fectDataCateAll = async () => {
    const res = await LandingPageApiService.getCategoriesHome();
    const formattedCategories = formatCategoriesToTreeData(res.category);
    setInitialData({ categories: formattedCategories });
  };

  const onChangePage = (page, per_page) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(page, per_page, start_date.current, end_date.current);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(
    page,
    per_page,
    start_date,
    end_date,
    category_id = valueFilter,
    bfs = isBFS,
    period_review = periodReview,
  ) {
    setIsLoading(true);
    let result = await DashboardTopAppService.getDashboardGrowthApps(
      page,
      per_page,
      start_date,
      end_date,
      category_id,
      bfs,
      period_review,
    );

    if (result) {
      setData(result.data);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const searchByDate = () => {
    let newParams = {
      ...params,
      page: 1,
      per_page: perPage,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(1, perPage, start_date.current, end_date.current);
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      start_date.current = dates[0].format(dateFormat);
      end_date.current = dates[1].format(dateFormat);
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const handleIsBFS = () => {
    const newBFS = !isBFS;
    setIsBFS(newBFS);
    setIsActiveBFS(!isActiveBFS);

    const newParams = {
      ...params,
      page: 1,
      per_page: perPage,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(1, numberPage, start_date.current, end_date.current, valueFilter, newBFS, periodReview);
  };

  const handlePeriodChange = (value) => {
    setPeriodReview(value);

    const newParams = {
      ...params,
      page: 1,
      per_page: perPage,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    fetchData(1, numberPage, start_date.current, end_date.current, valueFilter, isBFS, value);
  };

  const onChangeFilter = (value) => {
    if (value === undefined) {
      setValueFilter('');
      fetchData(currentPage, numberPage, start_date.current, end_date.current, '', isBFS, periodReview);
    } else {
      setValueFilter(value);
      fetchData(currentPage, numberPage, start_date.current, end_date.current, value, isBFS, periodReview);
    }
  };

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

  const renderRateGrowthIcon = (current, before) => {
    if (current !== before) {
      return current - before > 0 ? <UpOutlined /> : <DownOutlined />;
    }
    return null;
  };

  const getStarRateGrowthColor = (current, before) => {
    if (current !== before) {
      return current - before > 0 ? '#28a745' : '#dc3544';
    }
    return 'transparent';
  };

  const formatStarRateValue = (current, before) => {
    const difference = Math.abs(current - before);
    if (difference % 1 === 0) {
      return Math.floor(difference);
    }
    return difference.toFixed(1);
  };

  const renderRateGrowthInfo = (current, before) => (
    <span
      className="star-growth"
      style={{
        marginLeft: '5px',
        color: '#ffffff',
        backgroundColor: getStarRateGrowthColor(current, before),
        borderRadius: '8px',
        padding: '2px 5px',
        fontSize: '12px',
      }}
    >
      {renderRateGrowthIcon(current, before)}{' '}
      {Math.abs(current - before) > 0 && !isNaN(Math.abs(current - before))
        ? formatStarRateValue(current, before)
        : null}
    </span>
  );

  const getStarGrowthColor = (current, before) => {
    if (current !== before) {
      return current - before < 0 ? '#28a745' : '#dc3544';
    }
    return 'transparent';
  };

  const renderGrowthIcon = (current, before) => {
    if (current !== before) {
      return current - before < 0 ? <UpOutlined /> : <DownOutlined />;
    }
    return null;
  };

  const formatStarValue = (current, before) => {
    const difference = Math.abs(current - before);
    if (difference % 1 === 0) {
      return Math.floor(difference);
    }
    return difference.toFixed(1);
  };

  const renderGrowthInfo = (current, before) => (
    <span
      className="star-growth"
      style={{
        marginLeft: '5px',
        color: '#ffffff',
        backgroundColor: getStarGrowthColor(current, before),
        borderRadius: '8px',
        padding: '5px',
        fontSize: '12px',
      }}
    >
      {renderGrowthIcon(current, before)}{' '}
      {Math.abs(current - before) > 0 && !isNaN(Math.abs(current - before)) ? formatStarValue(current, before) : null}
    </span>
  );

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
      sorter: (a, b) => (a.detail?.name || '').localeCompare(b.detail?.name || ''),
      render: (text, record) => {
        return (
          <div className="content-app">
            <div className="image">
              <Image
                onClick={() => openAppDetail(record.detail.app_id)}
                src={record.detail.app_icon}
                alt=""
                width={75}
                height={75}
              />
            </div>
            <div className="item-detail-app">
              <div className="name-app-shopify">
                <Link href={'/app/' + record.detail.app_id} className="link-name">
                  {record.detail.name}
                </Link>
                {record.detail.built_for_shopify && (
                  <Tag className="built-for-shopify" icon={<SketchOutlined />} color="#108ee9">
                    Built for Shopify
                  </Tag>
                )}
              </div>
              <div className="tagline">{record.detail.tagline || record.detail.metatitle}</div>
              <div className="link-app-shopify">
                <Link
                  href={`https://apps.shopify.com/${record.detail.app_id}?utm_source=letsmetrix.com&utm_medium=app_listing&utm_content=${record.detail.name}`}
                  className="link"
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
      dataIndex: 'categories',
      key: 'growthRate',
      render: (categories, record) => (
        <>
          {categories.map((cat, index) => (
            <Row key={index} style={{ lineHeight: '30px' }}>
              <Col span={11}>
                <Link prefetch={false} href={`/category/${cat.category_id}`} target="_blank">
                  {cat.category_name}
                </Link>
              </Col>
              <Col span={11}>
                {cat.current_rank} / {cat.total_apps}
                {cat.current_rank && cat.before_rank && renderGrowthInfo(cat.current_rank, cat.before_rank)}
              </Col>
            </Row>
          ))}
          {record.bfs_info && (
            <Row style={{ lineHeight: '30px' }}>
              <Col span={11}>
                <Image
                  src="/image/diamond.svg"
                  alt="diamond"
                  width={15}
                  height={15}
                  style={{ margin: '-2px 3px 0px 0px' }}
                />
                <span>Built for Shopify</span>
              </Col>
              <Col span={11}>
                {record.bfs_info.current_rank} / {record.bfs_info.total_apps}
                {record.bfs_info.before_rank &&
                  record.bfs_info.current_rank &&
                  renderGrowthInfo(record.bfs_info.current_rank, record.bfs_info.before_rank)}
              </Col>
            </Row>
          )}
        </>
      ),
      sorter: (a, b) =>
        a.categories.reduce((sum, cat) => sum + (cat.rank_change || 0), 0) -
        b.categories.reduce((sum, cat) => sum + (cat.rank_change || 0), 0),
      width: 350,
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      sorter: (a, b) => {
        const totalA = a.categories ? a.categories.reduce((sum, item) => sum + (item.rank_change || 0), 0) : 0;
        const totalB = b.categories ? b.categories.reduce((sum, item) => sum + (item.rank_change || 0), 0) : 0;
        return totalA - totalB;
      },
      render: (total, record) => (
        <>
          {record.categories ? renderTagType(record.categories.reduce((sum, item) => sum + item.rank_change, 0)) : ''}
        </>
      ),
      width: 50,
    },
    {
      title: 'Rating',
      dataIndex: 'detail',
      key: 'rating',
      sorter: (a, b) => a.detail?.star - b.detail?.star,
      render: (rating, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="icon-star">
            {record.detail.star > 5 ? record.detail.star / 10 : record.detail.star} <StarFilled />
          </div>
          {renderRateGrowthInfo(record.current_star, record.before_star)}
        </div>
      ),
      width: 100,
    },
    {
      title: 'Reviews',
      dataIndex: 'reviews',
      key: 'reviews',
      sorter: (a, b) => a.current_review - b.current_review,
      render: (reviews, record) => (
        <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>{record.current_review > 0 ? record.current_review : record.review_count || null}</div>
          {renderRateGrowthInfo(record.current_review, record.before_review)}
        </div>
      ),
      width: 50,
    },
  ];

  return (
    <Spin spinning={isLoading}>
      <div className="detail-top-growth-app">
        <div className="detail-top-growth-app-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                Top Growth Apps
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>
        <div className="detail-top-growth-app-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Top Growth Apps</h1>
              <div className="title-apps">{total} apps</div>
            </div>
          </div>
          <div className="container-filter-range">
            <div className="dashboard-range">
              <RangePicker
                defaultValue={[dayjs(start_date.current, dateFormat), dayjs(end_date.current, dateFormat)]}
                format={dateFormat}
                allowClear={false}
                onChange={onChangeDateRange}
                disabledDate={disabledFutureDate}
              />
              <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
                Search
              </Button>
            </div>
            <div className="filter-apps">
              <div className={`btn-bfs ${isActiveBFS ? 'activeBFS' : ''}`} onClick={handleIsBFS}>
                <Image src="/image/diamond.svg" alt="diamond" width={15} height={15} />
                <span>Built For Shopify</span>
              </div>
              <div className="select-growth-apps">
                <Select defaultValue={0} style={{ width: 150 }} onChange={handlePeriodChange}>
                  <Select.OptGroup label="Filter by Review Count">
                    <Select.Option value={0}>All</Select.Option>
                    <Select.Option value={1}>0-50</Select.Option>
                    <Select.Option value={2}>50-100</Select.Option>
                    <Select.Option value={3}>100-200</Select.Option>
                    <Select.Option value={4}>200-500</Select.Option>
                    <Select.Option value={5}>500-1000</Select.Option>
                    <Select.Option value={6}>+1000</Select.Option>
                  </Select.OptGroup>
                </Select>
              </div>
              <div className="filter-cate">
                <TreeSelect
                  defaultValue={undefined}
                  showSearch
                  value={valueFilter || undefined}
                  placeholder="Please select"
                  onChange={onChangeFilter}
                  treeData={initialData?.categories}
                  virtual={false}
                  allowClear
                  style={{ width: '250px' }}
                  filterTreeNode={(inputValue, treeNode) => {
                    const searchTerms = inputValue.toLowerCase().split(' ');
                    const titleMatches = searchTerms.every((term) => treeNode.title.toLowerCase().includes(term));
                    return titleMatches;
                  }}
                />
              </div>
            </div>
          </div>
          <div className="detail-category">
            <Table
              columns={columns}
              dataSource={data}
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
