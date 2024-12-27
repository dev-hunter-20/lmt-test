'use client';

import React, { useEffect, useState } from 'react';
import { Checkbox, Empty, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartWeeklyKeyword.scss';

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
        {payload.map((entry, index) => {
          const formattedValue = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
          return (
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
                {formattedValue}: {entry.value}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return null;
};

export default function ChartWeeklyKeyword(props) {
  const [data, setData] = useState();
  const [hiddenItems, setHiddenItems] = useState([]);
  const [hideAll, setHideAll] = useState(false);

  useEffect(() => {
    setData(props.value);
  }, [props.value]);

  useEffect(() => {
    if (hideAll) {
      const allItems = data?.datasets.map((dataset) => dataset.label) || [];
      setHiddenItems(allItems);
    } else {
      setHiddenItems([]);
    }
  }, [hideAll, data]);

  const handleLegendClick = (dataKey) => {
    setHiddenItems((prev) => {
      if (prev.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey);
      } else {
        return [...prev, dataKey];
      }
    });
  };

  const chartData = data
    ? data.labels.map((label, index) => {
        const chartItem = { x: label };
        data.datasets.forEach((dataset) => {
          chartItem[dataset.label] = dataset.data[index];
        });
        return chartItem;
      })
    : [];

  return (
    <>
      <div className="header-chart">
        <div className="block-header">{props.title}</div>
        <Checkbox checked={hideAll} onChange={(e) => setHideAll(e.target.checked)}>
          Hide Data
        </Checkbox>
      </div>

      <div className={`${props.loading ? 'chart-loading' : 'chart'}`}>
        {props.loading ? (
          <Spin />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis reversed />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                onClick={(e) => handleLegendClick(e.dataKey)}
                formatter={(value) => {
                  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  return (
                    <span
                      style={{
                        textDecoration: hiddenItems.includes(value) ? 'line-through' : 'none',
                        fontSize: '12px',
                        color: '#000000',
                        cursor: 'pointer',
                      }}
                    >
                      {formattedValue}
                    </span>
                  );
                }}
              />
              {data.datasets.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  fill={dataset.backgroundColor}
                  activeDot={{ r: 7 }}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
                  hide={hiddenItems.includes(dataset.label)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
