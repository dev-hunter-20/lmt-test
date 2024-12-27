'use client';

import React, { useRef } from 'react';
import './TotalReview.scss';
import { useRouter } from 'next/navigation';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { date, value } = payload[0].payload;
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
        <p style={{ fontWeight: 'bold' }}>{date}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`Review count: ${value}`}</p>
      </div>
    );
  }

  return null;
};

export default function TotalReview(props) {
  const currentDate = useRef();
  const router = useRouter();

  const createData = (data) => {
    return data.map((item) => ({
      date: item._id,
      value: item.review_count || item.developer_count,
    }));
  };

  const reviewsByDate = (data) => {
    const current = data.activeLabel;
    currentDate.current = current;

    if (props.isDeveloper) {
      router.push(`/developers-by-day?date=${current}`);
      return;
    }
    router.push(`/dashboard/review?created_at=${current}`);
  };

  const handleClick = (data) => {
    if (data && data.activeLabel) {
      reviewsByDate(data);
    }
  };

  return (
    <div className="total-chart">
      <ResponsiveContainer width="100%" height={370}>
        <LineChart
          data={createData(props.data)}
          onClick={handleClick}
          onMouseLeave={() => {
            document.body.style.cursor = 'default';
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            name="Review count"
            stroke="#41ad9f"
            activeDot={{ r: 8 }}
            strokeWidth={1.5}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
