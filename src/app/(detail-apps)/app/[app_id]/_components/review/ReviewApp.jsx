'use client';

import React, { useEffect, useState } from 'react';
import {
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  MoreOutlined,
  PoweroffOutlined,
} from '@ant-design/icons';
import {
  Pagination,
  Rate,
  Progress,
  Select,
  Button,
  Breadcrumb,
  Empty,
  message,
  Switch,
  Popover,
  Tooltip,
  Skeleton,
  Spin,
} from 'antd';
import './ReviewApp.scss';
import ReviewItem from './item/ReviewItem';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Auth from '@/utils/store/Authentication';
import LayoutDetailApp from '../detaill-app-not-logged/LayoutDetailApp';
import Image from 'next/image';

export default function ReviewApp() {
  const params = useParams();
  const idDetail = params.app_id;
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;
  const [listOfReview, setListOfReview] = useState({ data: [], total_all: 0 });
  const [total, setTotal] = useState();
  const [countData, setCountData] = useState({ total_reviews: 0, rating: [], reviewer_location: [] });
  const [sort, setSort] = useState('create_date');
  const [isDeleted, setIsDeleted] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nameLocation, setNameLocation] = useState('');
  const [rating, setRating] = useState('');
  const [timeSpent, setTimeSpent] = useState('');
  const [replyTime, setReplyTime] = useState('');
  const [reviewNature, setReviewNature] = useState('');
  const [showReply, setShowReply] = useState([]);
  const [valueFilter, setValueFilter] = useState([]);
  const isAuth = Auth.isAuthenticated();
  const router = useRouter();
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [visible, setVisible] = useState(false);
  const [prosList, setProsList] = useState([]);
  const [consList, setConsList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFeedback = () => {
    message.info('Thanks for the feedback');
    setVisible(false);
  };

  const content = (
    <div>
      <Button className="feedback-button" type="link" onClick={() => handleFeedback()}>
        Helpful
      </Button>
      <br />
      <Button className="feedback-button" type="link" onClick={() => handleFeedback()}>
        Not Helpful
      </Button>
    </div>
  );

  const handleBack = () => {
    router.back();
  };

  // Get review list
  const getReviewListDetailApp = async (
    id,
    is_deleted,
    pageDefault,
    perPage,
    sort_by,
    reviewer_location,
    time_spent_using_app,
    rating,
    replyTime,
    reviewNature,
  ) => {
    try {
      setLoading(true);
      const res = await DetailAppApiService.getReviewApp(
        id,
        is_deleted,
        pageDefault,
        perPage,
        sort_by,
        reviewer_location,
        time_spent_using_app,
        rating,
        replyTime,
        reviewNature,
      );
      setShowReply([]);
      if (res.code === 0) {
        setListOfReview(res);
        setTotal(res.total_all);
      } else {
        message.error(res.message);
      }
    } catch (error) {
      message.error('An error occurred while fetching review list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res, resSummary] = await Promise.all([
          getReviewListDetailApp(
            idDetail,
            isDeleted,
            PAGE_DEFAULT_REVIEW,
            PER_PAGE_REVIEW,
            sort,
            nameLocation,
            timeSpent,
            rating,
            reviewNature,
            replyTime,
          ),
          DetailAppApiService.getReviewAppInfoSummary(idDetail),
        ]);
        setCountData(resSummary.data);
        setProsList(
          resSummary.data.pros_app
            ? resSummary.data.pros_app.split('\n').map((item) => item.replace(/^- /, '').trim())
            : [],
        );
        setConsList(
          resSummary.data.cons_app
            ? resSummary.data.cons_app.split('\n').map((item) => item.replace(/^- /, '').trim())
            : [],
        );
      } catch (error) {
        message.error('An error occurred while fetching data summary.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [sort, isDeleted, nameLocation, timeSpent, rating, reviewNature, replyTime]);

  const handleClickGetItem = (type, value) => {
    if (type === 'location') {
      setValueFilter([...valueFilter, value]);
      setNameLocation(value);
    } else if (type === 'rating') {
      setValueFilter([...valueFilter, `${value} star`]);
      setRating(value);
    } else if (type === 'reply_time') {
      setValueFilter([...valueFilter, value]);
      setReplyTime(value);
    } else if (type === 'review_nature') {
      setValueFilter([...valueFilter, value]);
      setReviewNature(value);
    } else {
      setValueFilter([...valueFilter, value]);
      setTimeSpent(value);
    }
  };

  const handleClickResetData = () => {
    getReviewListDetailApp(idDetail, 0, PAGE_DEFAULT_REVIEW, PER_PAGE_REVIEW, 'create_date', '', '', '', '', '');
    setNameLocation('');
    setTimeSpent('');
    setRating('');
    setReplyTime('');
    setReviewNature('');
    setValueFilter([]);
  };

  const handleChangeSort = (value) => {
    setIsDeleted(value);
    if (value === 0 || value === 1) {
      setIsDeleted(value);
    }
    if (value === 2) {
    }
  };

  const checkTimeSpent = (type) => {
    switch (type) {
      case 'lt_1_days':
        return 'Less than 1 day';
      case 'lt_3_days':
        return 'Less than 3 days';
      case 'lt_7_days':
        return 'Less than 7 days';
      case 'lt_14_days':
        return 'Less than 14 days';
      case 'lt_28_days':
        return 'Less than 28 days';
      default:
        return 'Other';
    }
  };

  const sumReviews = (data) => {
    return data.reduce((total, item) => total + item.total_reviews, 0);
  };

  const renderNature = (data) => {
    return [
      {
        title: 'Negative',
        label: data.negative,
        value: 'negative',
      },
      {
        title: 'Positive',
        label: data.positive,
        value: 'positive',
      },
      {
        title: 'Objective',
        label: data.objective,
        value: 'objective',
      },
      {
        title: 'Subjective',
        label: data.subjective,
        value: 'subjective',
      },
    ];
  };

  const getSumNature = (count) => {
    return count.negative + count.positive + count.objective + count.subjective;
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderSection = (condition, data, fallbackKey, skeletonRows = 2) => {
    if (condition) {
      return data;
    }
    return (
      <>
        {countData?.[fallbackKey]?.length > 0 ? (
          <Skeleton active paragraph={{ rows: skeletonRows }} />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </>
    );
  };

  const renderContentReviews = () => {
    return (
      <div className="container">
        <div className="review_app_wrapper">
          <div className="review_app_flex_box_title">
            <div className="title-review_name-app">
              <h1 className="review_app_name">
                {countData?.app_name ? `${countData.app_name} Reviews` : 'Loading Reviews...'}
              </h1>
              <p className="review_app_name_overall">{total > 0 ? `Total: ${total} reviews` : 'Total: 0 reviews'}</p>
            </div>
            <div className="scroll_list_show_normal">
              <p className="title_style">Overall rating</p>
              <Spin spinning={loading}>
                {renderSection(
                  total > 0,
                  countData.rating?.map(
                    (item, index) =>
                      item._id !== null && (
                        <div key={index} className="review_app_flex_box_title_wrapper">
                          <p className="overall_rating">{item._id}</p>

                          <Rate disabled={true} style={{ color: '#ffc225' }} count={1} value={1}></Rate>
                          <Progress
                            showInfo={false}
                            percent={(item.total_reviews / sumReviews(countData.rating)) * 100}
                          />
                          <p className="onhover_click_data" onClick={() => handleClickGetItem('rating', item._id)}>
                            {item.total_reviews}
                          </p>
                        </div>
                      ),
                  ),
                  'rating',
                )}
              </Spin>
            </div>
            <div>
              <p className="title_style">Top Locations</p>
              <div className="scroll_list_show">
                <Spin spinning={loading}>
                  {renderSection(
                    total > 0,
                    countData.reviewer_location?.map(
                      (item, index) =>
                        item._id !== null && (
                          <div key={index} className="review_app_flex_box_title_wrapper">
                            <p>{item.value}</p>
                            <Progress
                              showInfo={false}
                              percent={(item.total_reviews / sumReviews(countData.reviewer_location)) * 100}
                            />
                            <p className="onhover_click_data" onClick={() => handleClickGetItem('location', item._id)}>
                              {item.total_reviews}
                            </p>
                          </div>
                        ),
                    ),
                    'reviewer_location',
                  )}
                </Spin>
              </div>
            </div>
            <div>
              <p className="title_style">Time Spent</p>
              <div className="scroll_list_show">
                <Spin spinning={loading}>
                  {renderSection(
                    total > 0,
                    countData.time_spent_using_app?.map(
                      (item, index) =>
                        item._id !== null && (
                          <div key={index} className="review_app_flex_box_title_wrapper">
                            <p>{checkTimeSpent(item._id)}</p>
                            <Progress
                              showInfo={false}
                              percent={(item.total_reviews / sumReviews(countData.time_spent_using_app)) * 100}
                            />
                            <p className="onhover_click_data" onClick={() => handleClickGetItem('timeSpent', item._id)}>
                              {item.total_reviews}
                            </p>
                          </div>
                        ),
                    ),
                    'total_reviews',
                  )}
                </Spin>
              </div>
            </div>
            <div>
              <p className="title_style">Review Reply Time</p>
              <div className="scroll_list_show">
                <Spin spinning={loading}>
                  {renderSection(
                    total > 0,
                    countData.time_reply
                      ?.filter((item) => item.total_reviews)
                      ?.map(
                        (item, index) =>
                          item._id !== null && (
                            <div key={index} className="review_app_flex_box_title_wrapper">
                              <p>{checkTimeSpent(item._id)}</p>
                              <Progress
                                showInfo={false}
                                percent={(item.total_reviews / sumReviews(countData.time_reply)) * 100}
                              />
                              <p
                                className="onhover_click_data"
                                onClick={() => handleClickGetItem('reply_time', item._id)}
                              >
                                {item.total_reviews}
                              </p>
                            </div>
                          ),
                      ),
                    'total_reviews',
                  )}
                </Spin>
              </div>
            </div>
            <div>
              <p className="title_style">Nature of reviews</p>
              <div className="scroll_list_show">
                <Spin spinning={loading}>
                  {renderSection(
                    total > 0,
                    renderNature(countData).map((item, index) => (
                      <div key={index} className="review_app_flex_box_title_wrapper">
                        <p>{item.title}</p>
                        <Progress showInfo={false} percent={(item.label / getSumNature(countData)) * 100} />
                        <p
                          className="onhover_click_data"
                          onClick={() => handleClickGetItem('review_nature', item.value)}
                        >
                          {item.label}
                        </p>
                      </div>
                    )),
                    'label',
                  )}
                </Spin>
              </div>
            </div>
          </div>
          <div className="review-content">
            <Spin spinning={loading}>
              <div className={`content-ai ${isExpanded ? 'expanded' : ''}`}>
                {countData && countData.ai_think && total && total > 30 ? (
                  <>
                    <div className="title">
                      <strong>
                        <span>
                          <Tooltip title={'AI-generated review summary'}>
                            <Image src={'/image/ai-summary.webp'} alt="" width={36} height={37} />
                          </Tooltip>
                          What people think about this app?
                        </span>
                        <Switch checked={isContentVisible} onChange={() => setIsContentVisible(!isContentVisible)} />
                      </strong>
                      <div className="action-feedback">
                        <Popover
                          content={content}
                          trigger="click"
                          visible={visible}
                          onVisibleChange={(visible) => setVisible(visible)}
                          placement="bottomLeft"
                        >
                          <MoreOutlined />
                        </Popover>
                      </div>
                    </div>

                    {isContentVisible ? (
                      <>
                        <div className="desc">
                          {countData && countData.ai_think ? (
                            <p>{countData && countData.ai_think ? countData.ai_think : null}</p>
                          ) : (
                            <p>Loading reviews...</p>
                          )}
                        </div>
                        <div className="summary">
                          <div className="pros">
                            <strong>Pros</strong>
                            {prosList && prosList.length ? (
                              <>
                                {prosList.length ? (
                                  <ul>
                                    {prosList.map((pros, index) => (
                                      <li key={index}>
                                        <CaretUpOutlined />
                                        <span>{pros}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </>
                            ) : (
                              <p>Loading Pros...</p>
                            )}
                          </div>
                          <div className="cons">
                            <strong>Cons</strong>
                            {consList && consList.length ? (
                              <>
                                {consList.length ? (
                                  <ul>
                                    {consList.map((con, index) => (
                                      <li key={index}>
                                        <CaretDownOutlined />
                                        <span>{con}</span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : null}
                              </>
                            ) : (
                              <p>Loading Cons...</p>
                            )}
                          </div>
                        </div>
                        <button onClick={toggleExpand} className="expand-button">
                          {isExpanded ? 'Read Less' : 'Read More'}
                        </button>
                      </>
                    ) : (
                      <div className="desc">
                        <span>Use AI to summarize the reviews</span>
                      </div>
                    )}
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                )}
              </div>
            </Spin>
            <div className="review_app_flex_box_content">
              <strong>Reviews</strong>
              <Spin spinning={loading}>
                <div className="review_app_flex_box_content_sort">
                  {listOfReview.data?.length ? (
                    <>
                      <p>Show: </p>
                      <Select
                        value={sort}
                        style={{ width: 130 }}
                        onChange={(value) => setSort(value)}
                        options={[
                          { value: 'create_date', label: 'Create Date' },
                          { value: 'relevance_position', label: 'Relevance Position' },
                        ]}
                      />
                      <Select
                        value={isDeleted}
                        style={{ width: 130 }}
                        onChange={handleChangeSort}
                        options={[
                          { value: 0, label: 'Full Reviews' },
                          { value: 1, label: 'Deleted' },
                        ]}
                      />
                      {valueFilter.length > 0 && (
                        <>
                          <Select
                            mode="multiple"
                            disabled
                            style={{
                              width: '50%',
                            }}
                            value={valueFilter}
                          />
                          <Button type="primary" icon={<PoweroffOutlined />} onClick={() => handleClickResetData()}>
                            {' '}
                            Reset Filter{' '}
                          </Button>
                        </>
                      )}
                    </>
                  ) : null}
                </div>
                {listOfReview && (
                  <ReviewItem
                    data={listOfReview}
                    appName={countData ? countData.app_name : 'N/A'}
                    showReply={showReply}
                    setShowReply={setShowReply}
                    loading={loading}
                  />
                )}
                {listOfReview.data?.length ? (
                  <Pagination
                    total={listOfReview.total_all}
                    onChange={(page, pageSize) => {
                      getReviewListDetailApp(
                        idDetail,
                        isDeleted,
                        page,
                        pageSize,
                        sort,
                        nameLocation,
                        timeSpent,
                        rating,
                        reviewNature,
                        replyTime,
                      );
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`}
                  />
                ) : null}
              </Spin>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {isAuth ? (
        <>
          <div className="detail-developers-header">
            <div className="container">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                  App
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  {!loading && countData?.app_name && countData?.app_id ? (
                    <Link prefetch={false} href={`/app/${countData?.app_id}`}>
                      {countData?.app_name}
                    </Link>
                  ) : (
                    <Skeleton.Input active size={'small'} block />
                  )}
                </Breadcrumb.Item>
                <Breadcrumb.Item>Reviews</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
          {renderContentReviews()}
        </>
      ) : (
        <LayoutDetailApp>{renderContentReviews()}</LayoutDetailApp>
      )}
    </>
  );
}
