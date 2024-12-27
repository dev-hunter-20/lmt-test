'use client';

import React, { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';
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
          <div
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '5px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.fill,
                marginRight: '8px',
              }}
            ></div>
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

export default function NewApps({ appsByDay }) {
  const router = useRouter();
  const [hiddenItems, setHiddenItems] = useState([]);

  const dataByDay = useMemo(() => {
    return appsByDay ? [...appsByDay].reverse() : [];
  }, [appsByDay]);

  const handleShow = (data) => {
    if (data && data.activeLabel) {
      const current = dataByDay.find((item) => item._id === data.activeLabel);
      if (current) {
        router.push(`/app-by-day?sort_by=newest&date=${current._id}`);
      }
    }
  };

  const getData = (type) => {
    return dataByDay.map((item) => {
      const appData = item.counts.find((count) => count.type === type);
      return appData ? appData.count : 0;
    });
  };

  const chartData = dataByDay.map((item, index) => ({
    date: item._id,
    newApps: getData('created')[index],
    deletedApps: getData('deleted')[index],
    delistedApps: getData('unlisted')[index],
  }));

  const visibleData = chartData.filter((item) => !hiddenItems.includes(item.name));

  const handleLegendClick = (itemName) => {
    setHiddenItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    );
  };

  return (
    <div className="chart-new-apps">
      <div className="flex justify-between">
        <div style={{ marginBottom: '20px' }}>
          <div className="chart-title">New applications</div>
          <div className="chart-desc">Number of new applications per day</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          width={800}
          height={400}
          data={visibleData}
          margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
          onClick={handleShow}
          style={{ cursor: 'pointer' }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            onClick={(e) => handleLegendClick(e.value)}
            formatter={(value, entry) => (
              <span
                style={{
                  textDecoration: hiddenItems.includes(value) ? 'line-through' : 'none',
                  fontSize: '12px',
                  color: '#000000',
                  cursor: 'pointer',
                }}
              >
                {value}
              </span>
            )}
          />
          <Bar
            dataKey="newApps"
            fill="#41ad9f"
            stackId="a"
            name="New Apps"
            barSize={25}
            hide={hiddenItems.includes('New Apps')}
          />
          <Bar
            dataKey="deletedApps"
            fill="#ff4d4d"
            stackId="b"
            name="Deleted Apps"
            barSize={25}
            hide={hiddenItems.includes('Deleted Apps')}
          />
          <Bar
            dataKey="delistedApps"
            fill="#ffcc4d"
            stackId="b"
            name="Delisted Apps"
            barSize={25}
            hide={hiddenItems.includes('Delisted Apps')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
