'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import './TopStore.scss';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { _id, review_count } = payload[0].payload;
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
        <p style={{ fontWeight: 'bold' }}>{_id}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`Review count: ${review_count}`}</p>
      </div>
    );
  }

  return null;
};

export default function TopStore(props) {
  const router = useRouter();

  const viewStore = (id) => {
    router.push(`/dashboard/review?${props.isStore ? 'nameReviewer' : 'reviewer_location'}=${id}`);
  };

  return (
    <div className="dashboard-table">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={props.data}
          onClick={(data) => {
            if (data && data.activeLabel) {
              viewStore(data.activePayload[0].payload._id);
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="review_count"
            name={'Review count'}
            fill={props.isStore ? '#A5D6A7' : '#41ad9f'}
            cursor="pointer"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
