'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Empty } from 'antd';
import './GrowRate.scss';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { app_name, total_ranking } = payload[0].payload;
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
        <p style={{ margin: 0, fontSize: '12px' }}>{`Total Ranking: ${total_ranking}`}</p>
      </div>
    );
  }

  return null;
};

export default function GrowRate({ growthRate }) {
  const data = useMemo(() => {
    return growthRate
      .map((app) => ({
        app_name: app.app_name,
        total_ranking: app.count,
      }))
      .reverse();
  }, [growthRate]);

  return (
    <div className="growth-rate_chart">
      {growthRate && growthRate.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis dataKey="app_name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total_ranking" name={'Total Ranking'} fill="#41ad9f" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
