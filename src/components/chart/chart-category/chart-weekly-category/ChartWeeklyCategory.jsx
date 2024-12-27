'use client';

import { Checkbox, Empty, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartWeeklyCategory.scss';
import { useEffect, useMemo, useState } from 'react';

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

export const ChartWeeklyCategory = (props) => {
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

  const chartData = data
    ? data.labels.map((label, index) => {
        const chartItem = { x: label };
        data.datasets.forEach((dataset) => {
          chartItem[dataset.label] = dataset.data[index];
        });
        return chartItem;
      })
    : [];

  const visibleData = chartData.filter((item) => !hiddenItems.includes(item.name));

  const handleLegendClick = (dataKey) => {
    setHiddenItems((prev) => {
      if (prev.includes(dataKey)) {
        return prev.filter((key) => key !== dataKey);
      } else {
        return [...prev, dataKey];
      }
    });
  };

  const dataMax = useMemo(() => {
    if (props.value && props.value.datasets) {
      return Math.max(...props.value.datasets.flatMap((dataset) => dataset.data));
    }
    return 0;
  }, [props.value]);

  return (
    <>
      <div className="header-chart">
        {props.title ? (
          <div className="block-header">{props.title}</div>
        ) : (
          <div className="block-header">Category Positional Changes</div>
        )}
        <Checkbox checked={hideAll} onChange={(e) => setHideAll(e.target.checked)}>
          Hide Data
        </Checkbox>
      </div>

      <div className={`${props.loading ? 'chart-loading' : 'chart'}`}>
        {props.loading ? (
          <Spin />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={visibleData} margin={{ top: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis reversed />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                wrapperStyle={{ paddingTop: 10 }}
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
};
