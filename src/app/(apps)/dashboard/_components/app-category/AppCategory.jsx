'use client';

import React, { useMemo, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useRouter } from 'next/navigation';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        <p style={{ fontSize: '14px', marginBottom: '5px', fontWeight: 500 }}>{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.stroke,
                marginRight: '8px',
              }}
            />
            <p style={{ margin: 0, fontSize: '12px' }}>
              {entry.name}: {entry.value}
            </p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default function AppCategory({ appsBFS }) {
  const router = useRouter();
  const [hiddenItems, setHiddenItems] = useState([]);

  const dataByDay = useMemo(() => {
    return appsBFS ? [...appsBFS].reverse() : [];
  }, [appsBFS]);

  const labels = [...new Set(dataByDay.map((item) => item._id.date))];
  const activeList = dataByDay.filter((item) => item._id.type === 'active');
  const inactiveList = dataByDay.filter((item) => item._id.type === 'inactive');

  const chartData = labels.map((date) => ({
    date,
    active: activeList.find((item) => item._id.date === date)?.count_app || 0,
    inactive: inactiveList.find((item) => item._id.date === date)?.count_app || 0,
  }));

  const visibleData = chartData.filter((item) => !hiddenItems.includes(item.name));

  const handleLegendClick = (dataKey) => {
    setHiddenItems((prev) => (prev.includes(dataKey) ? prev.filter((key) => key !== dataKey) : [...prev, dataKey]));
  };

  const handleShow = (data) => {
    if (data && data.activePayload && data.activePayload.length) {
      const { date } = data.activePayload[0].payload;
      if (data.activePayload.some((item) => item.name === 'Built for Shopify')) {
        router.push(`/built-for-shopify-app?sort_by=active&date=${date}&type=bfs`);
      } else if (data.activePayload.some((item) => item.name === 'Removed')) {
        router.push(`/built-for-shopify-app?sort_by=inactive&date=${date}&type=bfs`);
      }
    }
  };

  return (
    <div style={{ marginTop: '30px' }}>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={visibleData}
          margin={{ top: 7, right: 10, left: -30, bottom: 10 }}
          onClick={(data) => handleShow(data)}
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onClick={(e) => handleLegendClick(e.dataKey)}
            formatter={(value, entry) => (
              <span
                style={{
                  textDecoration: hiddenItems.includes(entry.dataKey) ? 'line-through' : 'none',
                  fontSize: '12px',
                  color: '#000000',
                  cursor: 'pointer',
                }}
              >
                {value}
              </span>
            )}
          />
          <Line
            type="monotone"
            dataKey="active"
            name="Built for Shopify"
            stroke="#41ad9f"
            activeDot={{ r: 8 }}
            strokeWidth={1.5}
            dot={{ r: 2 }}
            hide={hiddenItems.includes('active')}
          />
          <Line
            type="monotone"
            dataKey="inactive"
            name="Removed"
            stroke="#ff4d4d"
            activeDot={{ r: 8 }}
            strokeWidth={1.5}
            dot={{ r: 2 }}
            hide={hiddenItems.includes('inactive')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
