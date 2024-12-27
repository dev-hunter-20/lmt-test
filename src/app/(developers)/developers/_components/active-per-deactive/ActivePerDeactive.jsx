'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ActivePerDeactive.scss';

const ActivePerDeactive = (props) => {
  const [hiddenItems, setHiddenItems] = useState([]);
  const filteredData = props.data.filter((item) => item.value !== 0);

  const fixedColors = ['#41ad9f', '#e74c3c'];

  const dataWithColors = useMemo(() => {
    return filteredData.map((item, index) => ({
      ...item,
      color: fixedColors[index % fixedColors.length],
    }));
  }, [filteredData]);

  const visibleData = dataWithColors.filter((item) => !hiddenItems.includes(item.type));

  const handleLegendClick = (itemName) => {
    setHiddenItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    );
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    return (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
        {value}
      </text>
    );
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { type, value, color } = payload[0].payload;
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
            {type}: {value}
          </p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="pie-chart_de-ac">
      <ResponsiveContainer width={500} height={400}>
        <PieChart>
          <Pie
            data={visibleData}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={150}
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {visibleData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} opacity={hiddenItems.includes(entry.type) ? 0.3 : 1} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            layout="vertical"
            verticalAlign="middle"
            align="right"
            onClick={(e) => handleLegendClick(e.value)}
            payload={dataWithColors.map((item) => ({
              id: item.type,
              value: item.type,
              type: 'square',
              color: item.color,
              inactive: hiddenItems.includes(item.type),
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
};

export default ActivePerDeactive;
