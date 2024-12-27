'use client';

import React from 'react';
import './AppReview.scss';
import { Progress, Rate, Table, Tooltip } from 'antd';
import Link from 'next/link';
import { CaretDownOutlined, CaretUpOutlined, RiseOutlined, StarFilled } from '@ant-design/icons';
import { BASE_URL } from '@/common/constants';

export default function AppReview({ compareAppData }) {
  const transposedDataReview = [
    {
      key: 'rating',
      title: 'Rating',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => (
        <>
          <div className="user">
            <span className="rating-count">{item.detail.star}</span>
            <div className="user-count">
              <StarFilled style={{ fontSize: '18px', color: 'rgb(219, 173, 57)' }} />
              <span>{`(${item.detail.review_count})`}</span>
            </div>
          </div>
          <Rate allowHalf value={item.detail.star} style={{ color: '#dbad39' }} />
        </>
      )),
    },
    {
      key: 'ratingDistribution',
      title: 'Rating Distribution',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        const convertToStarDetail = (arr) => {
          return arr.map((value) => ({
            percent: (value / arr.reduce((a, b) => a + b, 0)) * 100,
            count: value,
          }));
        };

        const starDetails = convertToStarDetail(item.detail.star_detail);

        const formatNumber = (num) => {
          if (num >= 1000) {
            const formattedNumber = (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1);
            return formattedNumber + 'K';
          }
          return num.toString();
        };

        const topLocations = item.reviewer_location
          ? item.reviewer_location.map((loc) => ({
              ...loc,
              percent: (loc.total_reviews / item.reviewer_location.reduce((a, b) => a + b.total_reviews, 0)) * 100,
            }))
          : null;

        const reviewDes = item.review_summary
          ? item.review_summary.map((review) => ({
              ...review,
              content: review.content,
            }))
          : null;

        return (
          <div className="container-rating-distribution" key={item.app_id}>
            <div className="rating-distribution">
              <div className="star-review">
                <span className="text-rating">Overall rating</span>
                {starDetails.length > 0 ? (
                  <>
                    {starDetails.map((review, index) => (
                      <div key={index} className="star-progress">
                        <span className="star">{5 - index}</span>
                        <Rate
                          disabled={true}
                          style={{ color: '#dbad39', fontSize: '14px', marginRight: 5 }}
                          count={1}
                          value={index + 1}
                        />
                        <Progress
                          percent={review.percent}
                          strokeColor={'#dbad39'}
                          showInfo={false}
                          style={{ flex: 1 }}
                        />
                        <span className="count">{formatNumber(review.count)}</span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="top-location not-available">Not Available</div>
                )}
              </div>
              <div className="location">
                <span className="text-rating">Top Locations</span>
                {topLocations ? (
                  <div className="top-location">
                    {topLocations.map((loc) => (
                      <div key={loc._id} className="star-progress">
                        <span className="location-name">
                          <Tooltip title={loc.value}>
                            {loc.value && loc.value.length > 12
                              ? `${loc.value.substring(0, 12)}...`
                              : loc.value || '...'}
                          </Tooltip>
                        </span>
                        <Progress percent={loc.percent} strokeColor={'#dbad39'} showInfo={false} style={{ flex: 1 }} />
                        <span className="count">{loc.total_reviews}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="top-location not-available">Not Available</div>
                )}
              </div>
              <div className="desc">
                {reviewDes ? (
                  <div className="content">
                    {reviewDes.map((con) => (
                      <div className="des" key={con.app_id}>
                        {con.star === 5 && <CaretUpOutlined />}
                        {con.star === 1 && <CaretDownOutlined />}
                        <p>{con.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="top-location not-available">Not Available</div>
                )}
              </div>
            </div>
            <div className="view-detail">
              <Link href={`${BASE_URL}app/${item.detail.app_id}/reviews`} target={`_blank${item.detail.app_id}`}>
                View all reviews
              </Link>
            </div>
          </div>
        );
      }),
    },
    {
      key: 'growthReview',
      title: 'Growth Review (30 days)',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => (
        <div className="growth-review" key={item.app_id}>
          <div className="count">{item.growth_review_in_30days || 0}</div> <RiseOutlined />
        </div>
      )),
    },
  ];

  const columnsReview = [
    {
      title: '',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => ({
      title: item.detail.name,
      dataIndex: `value${index}`,
      key: `value${index}`,
      width: 347,
    })),
  ];

  const dataSourceReview = transposedDataReview.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });

  return (
    <div className="app-review">
      <h2>Review</h2>
      <Table
        dataSource={dataSourceReview}
        columns={columnsReview}
        pagination={false}
        scroll={{ x: 1500 }}
        className="table-app"
      />
    </div>
  );
}
