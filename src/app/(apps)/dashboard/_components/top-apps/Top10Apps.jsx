'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, review_count } = payload[0].payload;
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
        <p style={{ fontWeight: 'bold' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`Review Count: ${review_count}`}</p>
      </div>
    );
  }

  return null;
};

export default function Top10Apps({ appsMostReview }) {
  const data = appsMostReview ? appsMostReview : [];

  return (
    <>
      <div className="chart-title flex justify-between">
        Top 10 applications have the most reviews
        <Link className="chart-title-more flex justify-center items-center" href="/top-most-review">
          Show more
        </Link>
      </div>
      <div className="chart-desc"></div>
      <div className="dashboard-table">
        <ResponsiveContainer width="100%" height={430}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="review_count" name="Review count" fill="#41ad9f" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
