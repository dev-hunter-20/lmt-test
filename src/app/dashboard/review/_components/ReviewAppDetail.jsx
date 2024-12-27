'use client';

import React, { useEffect, useState } from 'react';
import { ArrowLeftOutlined, DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons';
import './ReviewAppDetail.scss';
import { List, Pagination, Rate, Spin, Tag, Empty, Breadcrumb } from 'antd';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ReviewAppDetail() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [listOfReview, setListOfReview] = useState([]);

  const handleBack = () => {
    router.back();
  };

  const nameReviewer = searchParams.get('nameReviewer') || '';
  const reviewer_location = searchParams.get('reviewer_location') || '';
  const created_at = searchParams.get('created_at') || '';
  const PAGE_DEFAULT_REVIEW = 1;
  const PER_PAGE_REVIEW = 10;

  // Get review list
  const getReviewDashboardList = async (page, per_page, reviewer_location, reviewer_name, created_at, is_deleted) => {
    setLoading(true);
    const res = await DetailAppApiService.getReviewDashboard(
      page,
      per_page,
      reviewer_location,
      reviewer_name,
      created_at,
      is_deleted,
    );
    if (res) {
      setListOfReview(res);
    }
    setLoading(false);
  };

  useEffect(() => {
    getReviewDashboardList(PAGE_DEFAULT_REVIEW, PER_PAGE_REVIEW, reviewer_location, nameReviewer, created_at, '');
  }, [reviewer_location, nameReviewer, created_at]);

  const renderTitle = () => {
    const decodedReviewer = decodeURIComponent(nameReviewer || '');
    const decodedLocation = decodeURIComponent(reviewer_location || '');

    if (created_at) {
      return created_at;
    }
    if (decodedReviewer && decodedLocation) {
      return `${decodedReviewer} from ${decodedLocation}`;
    }
    if (decodedLocation) {
      return `merchants from ${decodedLocation}`;
    }
    if (decodedReviewer) {
      return decodedReviewer;
    }
    return '';
  };

  const constructTitle = () => {
    const baseTitle = 'All Shopify App Store reviews';
    const datePart = created_at ? ` created on ${renderTitle()}` : '';
    const reviewerPart = nameReviewer || reviewer_location ? ` by ${renderTitle()}` : '';

    return `${baseTitle}${datePart}${reviewerPart}`;
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              <Link prefetch={false} href={`/dashboard/reviews`}>
                Dashboard Review
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{renderTitle()}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="review_app_dashboard container">
        <h1 className="dashboard-title">{constructTitle()}</h1>
        {listOfReview && listOfReview.data && listOfReview.data.length > 0 ? (
          <List
            itemLayout="vertical"
            dataSource={listOfReview.data}
            size="large"
            renderItem={(item) => (
              <List.Item key={item.title}>
                <List.Item.Meta
                  title={
                    <div className="header-review">
                      <div className="flex items-center">
                        <Link
                          href={`/dashboard/review?nameReviewer=${item.reviewer_name}&reviewer_location=${item.reviewer_location}`}
                          style={{ fontWeight: 500, textDecoration: 'underline' }}
                          prefetch={false}
                        >
                          {item.reviewer_name}{' '}
                        </Link>
                        <InfoCircleOutlined
                          style={{
                            fontSize: '16px',
                            marginLeft: '5px',
                            cursor: 'pointer',
                            color: '#78726d',
                          }}
                        />
                        {item.is_deleted && (
                          <Tag
                            icon={<DeleteOutlined />}
                            style={{
                              borderRadius: '4px',
                              marginLeft: '10px',
                            }}
                            color="#cd201f"
                          >
                            Deleted
                          </Tag>
                        )}
                      </div>
                      <span className="lable-star">
                        <Rate disabled={true} style={{ color: '#ffc225', marginRight: '10px' }} value={item.star} />
                        <span className="created-date">{item.create_date} </span>
                      </span>
                    </div>
                  }
                />
                <div className="total">
                  From app:{' '}
                  <Link prefetch={false} href={`/app/${item.app_id}`} style={{ marginLeft: '5px' }}>
                    {item.app_name ? item.app_name : item.app_id.charAt(0).toUpperCase() + item.app_id.slice(1)}
                  </Link>
                </div>
                <div className="locale">
                  Location: <b>{item.reviewer_location}</b>
                  {item.time_spent_using_app ? ` - ${item.time_spent_using_app}` : ''}
                </div>
                <span className="content">{item.content}</span>
              </List.Item>
            )}
          />
        ) : (
          <>
            <Empty
              style={{ marginTop: '100px' }}
              description={<span style={{ fontSize: '20px', color: '#737373' }}>No Result!</span>}
            ></Empty>
          </>
        )}
        {listOfReview.data?.length ? (
          <div className="pagination">
            <Pagination
              total={listOfReview.total_all}
              onChange={(page, pageSize) =>
                getReviewDashboardList(page, pageSize, reviewer_location, nameReviewer, created_at, '')
              }
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total.toLocaleString('en-US')} reviews`}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </Spin>
  );
}
