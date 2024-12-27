'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb, Button, Col, DatePicker, Row, Spin } from 'antd';
import './DashboardReviewPage.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardReviewsApiService from '@/api-services/api/DashboardReviewsApiService';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import TotalReview from './total-review/TotalReview';
import DeletedPercent from './deleted-percent/DeletedPercent';
import TopStore from './top-store/TopStore';
import TopNewReviews from './top-new-reviews/TopNewReviews';

const { RangePicker } = DatePicker;

export default function DashboardReviewPage() {
  const dateFormat = 'YYYY-MM-DD';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'day').format(dateFormat));
  const [toDate, setToDate] = useState(dayjs().format(dateFormat));
  const [queryKey, setQueryKey] = useState(['dashboardDataReviews', fromDate, toDate]);

  const fetchDetailApp = async (fromDate, toDate) => {
    const [totalReviews, reviewsDeleted, topReviews, topStore, topLocation, reviewsCategory] = await Promise.all([
      DashboardReviewsApiService.getTotalReviews(fromDate, toDate),
      DashboardReviewsApiService.getReviewDeleted(fromDate, toDate),
      DashboardReviewsApiService.getTopNewReviews(fromDate, toDate),
      DashboardReviewsApiService.storeMostReview(fromDate, toDate),
      DashboardReviewsApiService.locationMostReview(fromDate, toDate),
      DashboardReviewsApiService.getReviewCategory(fromDate, toDate),
    ]);
    return {
      totalReviews: totalReviews.result,
      reviewsDeleted: reviewsDeleted.result,
      topReviews: topReviews.result,
      topStore: topStore.result,
      topLocation: topLocation.result,
      reviewsCategory: reviewsCategory.result,
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchDetailApp(fromDate, toDate),
  });

  useEffect(() => {
    const nameReviewer = searchParams.get('nameReviewer');
    const reviewerLocation = searchParams.get('reviewer_location');
    if (nameReviewer || reviewerLocation) {
      router.push(`review?nameReviewer=${nameReviewer}&reviewer_location=${reviewerLocation}`);
    }
  }, [searchParams]);

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      setFromDate(dates[0].format(dateFormat));
      setToDate(dates[1].format(dateFormat));
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    setQueryKey(['dashboardDataReviews', fromDate, toDate]);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <Spin spinning={isLoading}>
      <div className="review-dashboard_header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              Dashboard Review
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container dashboard">
        <h1 className="dashboard-title">Review Dashboard</h1>
        <div className="dashboard-range">
          <RangePicker
            defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
            format={dateFormat}
            allowClear={false}
            onChange={onChangeDateRange}
            disabledDate={disabledFutureDate}
          />
          <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
            Search
          </Button>
        </div>
        <Row className="dashboard-content" justify="space-between">
          <Col className="content-review-chart total-day">
            <div className="chart-title">Total Review By Day</div>
            <div className="chart-desc">Number of new reviews per day</div>
            <TotalReview data={data ? data?.totalReviews : []} />
          </Col>
          <Col className="content-review-chart percent-chart">
            <Row>
              <Col span={24}>
                <div className="chart-title">Category Breakdown</div>
              </Col>
              <div className="chart-desc">Number of reviews in category</div>
            </Row>
            <Row justify="center">
              {data && (
                <DeletedPercent
                  data={data?.reviewsCategory.map((item) => {
                    return {
                      type: item.name,
                      value: item.review_count,
                      _id: item._id,
                    };
                  })}
                  total={60}
                />
              )}
            </Row>
          </Col>
          <Col className="content-review-chart location-chart">
            <div className="chart-title">The store has the most reviews</div>
            <div className="chart-desc">
              Stage: {`${dayjs(fromDate).format(dateFormat)} - ${dayjs(toDate).format(dateFormat)}`}
            </div>
            <TopStore data={data ? data.topStore : []} isStore />
          </Col>
          <Col className="content-review-chart location-chart">
            <div className="chart-title">The location has the most reviews</div>
            <div className="chart-desc">
              Stage: {`${dayjs(fromDate).format(dateFormat)} - ${dayjs(toDate).format(dateFormat)}`}
            </div>
            <TopStore data={data ? data.topLocation : []} />
          </Col>
          <Col span={24} className="content-chart-reviews">
            <div className="chart-title">Top New Reviews</div>
            <TopNewReviews data={data ? data.topReviews : []} />
          </Col>
          <Col span={24} className="content-chart-reviews">
            <div className="chart-title">Deleted Reviews</div>
            <TopNewReviews data={data ? data.reviewsDeleted : []} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
