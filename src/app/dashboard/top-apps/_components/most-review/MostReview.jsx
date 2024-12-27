'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Empty } from 'antd';
import './MostReview.scss';

export const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { app_name, review_count } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '4px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <p style={{ fontWeight: 'bold' }}>{app_name}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`Review Count: ${review_count}`}</p>
      </div>
    );
  }

  return null;
};

export default function MostReview({ mostReview }) {
  const data = useMemo(() => {
    return mostReview
      .map((app) => ({
        app_name: app.detail.name,
        review_count: app.detail.review_count,
      }))
      .reverse();
  }, [mostReview]);

  return (
    <div className="most-review_chart">
      {mostReview && mostReview.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis dataKey="app_name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="review_count" name={'Review Count'} fill="#A5D6A7" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
