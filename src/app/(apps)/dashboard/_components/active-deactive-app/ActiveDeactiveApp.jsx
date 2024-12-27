'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ActiveDeactiveApp.scss';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {value}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, color } = payload[0].payload;
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '12px',
            height: '12px',
            backgroundColor: color,
            marginRight: '8px',
          }}
        />
        <p style={{ margin: 0, fontSize: '12px' }}>
          {name}: {value}
        </p>
      </div>
    );
  }

  return null;
};

export default function ActiveDeactiveApp({ statusApps }) {
  const [hiddenItems, setHiddenItems] = useState([]);

  const data = useMemo(() => {
    const appCounts = {
      created: 0,
      deleted: 0,
      unlisted: 0,
    };

    if (Array.isArray(statusApps)) {
      statusApps.forEach((app) => {
        if (appCounts.hasOwnProperty(app._id)) {
          appCounts[app._id] = app.app_count;
        }
      });
    }

    return [
      { name: 'Active Apps', value: appCounts.created, color: '#41ad9f' },
      { name: 'Deleted Apps', value: appCounts.deleted, color: '#ff4d4d' },
      { name: 'Delisted Apps', value: appCounts.unlisted, color: '#ffcc4d' },
    ].filter((item) => item.value > 0);
  }, [statusApps]);

  const visibleData = data.filter((item) => !hiddenItems.includes(item.name));

  const handleLegendClick = (itemName) => {
    setHiddenItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    );
  };

  return (
    <div className="pie-chart">
      <ResponsiveContainer width={400} height={400}>
        <PieChart>
          <Pie
            data={visibleData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {visibleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={hiddenItems.includes(entry.name) ? 0.3 : 1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            onClick={(e) => handleLegendClick(e.value)}
            payload={data.map((item) => ({
              id: item.name,
              value: item.name,
              type: 'square',
              color: item.color,
              inactive: hiddenItems.includes(item.name),
            }))}
            formatter={(value, entry) => (
              <span
                style={{
                  textDecoration: hiddenItems.includes(entry.id) ? 'line-through' : 'none',
                  fontSize: '12px',
                  color: '#000000',
                  cursor: 'pointer',
                }}
              >
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
