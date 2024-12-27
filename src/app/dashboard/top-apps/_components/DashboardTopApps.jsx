'use client';

import React, { useState } from 'react';
import './DashboardTopApps.scss';
import DashboardTopAppService from '@/api-services/api/DashboardTopAppService';
import { Breadcrumb, Col, message, Row, Spin, TreeSelect } from 'antd';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import GrowthReview from './growth-review/GrowthReview';
import ReviewCategory from './review-category/ReviewCategory';
import MostReview from './most-review/MostReview';
import GrowRate from './growth-rate/GrowRate';

export default function DashboardTopApps() {
  const [valueFilter, setValueFilter] = useState('finding-products');
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => ({
        value: item.slug,
        title: item.text,
        children: dataCategory(item.child) || [],
      }));
    }
  };

  const fetchInitialData = async () => {
    try {
      const [growthReview, growthRate, mostReview, allCategory] = await Promise.all([
        DashboardTopAppService.getDashboardGrowthReview(),
        DashboardTopAppService.getDashboardGrowthRate(),
        DashboardTopAppService.getDashboardMostReview(),
        LandingPageApiService.getCategoriesHome(),
      ]);

      if (growthReview.code === 0 && growthRate.code === 0 && mostReview.code === 0 && allCategory.code === 0) {
        const categories = dataCategory(allCategory?.category);
        return {
          growthReview: growthReview.result,
          growthRate: growthRate.data,
          mostReview: mostReview.result,
          categories,
        };
      }
    } catch (error) {
      message.error('Error fetching initial data:', error);
    }
  };

  const { data: initialData, isLoading: loadingInitialData } = useQuery({
    queryKey: ['fetchInitialData'],
    queryFn: fetchInitialData,
  });

  const fetchReviewCategoryData = async (category_id) => {
    try {
      const reviewCategory = await DashboardTopAppService.getDashboardReviewCategory(category_id);
      if (reviewCategory.code === 0) {
        return reviewCategory.result;
      }
    } catch (error) {
      message.error('Error fetching review category data:', error);
    }
  };

  const { data: reviewCategoryData, isLoading: loadingReviewCategory } = useQuery({
    queryKey: ['fetchReviewCategoryData', valueFilter],
    queryFn: () => fetchReviewCategoryData(valueFilter),
    enabled: !!initialData,
  });

  const onChangeFilter = (value) => {
    setValueFilter(value);
    queryClient.invalidateQueries(['fetchReviewCategoryData', value]);
  };

  const chartData =
    reviewCategoryData?.map((item) => ({
      type: item.apps.app_name,
      value: item.apps.review_count,
      _id: item._id,
    })) || [];

  return (
    <Spin spinning={loadingInitialData}>
      <div className="review-dashboard-cate_header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              Top App Dashboard
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container dashboard-cate">
        <h1 className="dashboard-cate-title">Top App Dashboard</h1>
        <Row className="dashboard-cate-content" justify="space-between">
          <Col className="content-chart total-day">
            <div className="title-top_chart">
              <div className="header-left">
                <div className="chart-title">Top the app growth review</div>
                <Link href={`/growth_review`}>Show more</Link>
              </div>
              <div className="chart-desc">Number of app growth reviews in 30 days</div>
            </div>
            <GrowthReview data={initialData?.growthReview || []} />
          </Col>
          <Col className="content-chart percent-chart">
            <Row>
              <Col span={24} className="top-review_cate">
                <div className="chart-title">Top App Review Distribution by Category</div>
                <div className="filter-cate">
                  <TreeSelect
                    showSearch
                    value={valueFilter}
                    placeholder="Please select"
                    onChange={onChangeFilter}
                    treeData={initialData?.categories}
                    virtual={false}
                  />
                </div>
              </Col>
              <div className="chart-desc">Distribution of App Reviews Across Categories</div>
            </Row>
            <Row justify="center">
              {chartData && <ReviewCategory chartData={chartData} loadingReviewCategory={loadingReviewCategory} />}
            </Row>
          </Col>
          <Col className="content-chart location-chart">
            <div className="title-top_chart">
              <div className="header-left">
                <div className="chart-title">Top Apps with the Most Reviews</div>
                <Link href={`/top-reviewed`}>Show more</Link>
              </div>
              <div className="chart-desc">Number of Reviews for Top Apps in the Last 30 Days</div>
            </div>
            <MostReview mostReview={initialData?.mostReview || []} />
          </Col>
          <Col className="content-chart location-chart">
            <div className="title-top_chart">
              <div className="header-left">
                <div className="chart-title">Top App Growth Ranking in Category</div>
                <Link href={`/growth_rate`}>Show more</Link>
              </div>
              <div className="chart-desc">App Growth Ranking in Category Over 30 Days</div>
            </div>
            <GrowRate growthRate={initialData?.growthRate || []} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
