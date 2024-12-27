'use client';

import React, { useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Empty } from 'antd';
import './TotalDeveloper.scss';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { date, count } = payload[0].payload;
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
        <p style={{ margin: 0, fontSize: '12px' }}>{`Developers: ${count}`}</p>
      </div>
    );
  }

  return null;
};

const TotalDeveloper = (props) => {
  const currentDate = useRef();

  const createData = (data) => {
    return data.map((item) => ({
      date: item._id,
      count: item.review_count || item.developer_count,
    }));
  };

  const handleShow = (id) => {
    currentDate.current = id;
    window.location.href = `/developers-by-day?date=${id}`;
  };

  const data = createData(props.data);

  return (
    <div className="total-chart">
      {props.data.length > 0 ? (
        <ResponsiveContainer width="100%" height={370}>
          <LineChart
            data={data}
            onClick={(e) => {
              if (e.activePayload && e.activePayload.length > 0) {
                handleShow(e.activePayload[0].payload.date);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Developers"
              stroke="#41ad9f"
              activeDot={{ r: 8 }}
              strokeWidth={1.5}
              dot={{ r: 2 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
      )}
    </div>
  );
};

export default TotalDeveloper;
