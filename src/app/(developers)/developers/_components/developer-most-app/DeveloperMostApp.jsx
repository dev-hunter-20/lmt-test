'use client';

import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, count_app } = payload[0].payload;
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
        <p style={{ fontWeight: 'bold' }}>{name}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`App Count: ${count_app}`}</p>
      </div>
    );
  }

  return null;
};

const DeveloperMostApp = (props) => {
  const history = useRouter();

  const viewStore = (id) => {
    history.push(`/developer/${id}`);
  };

  const nameOccurrences = {};

  const updatedData = useMemo(() => {
    return props.data.map((item) => {
      const { name } = item;
      if (nameOccurrences[name]) {
        nameOccurrences[name]++;
        return { ...item, name: `${name}-${nameOccurrences[name]}` };
      } else {
        nameOccurrences[name] = 1;
        return item;
      }
    });
  }, [props.data]);

  return (
    <div className="dashboard-table">
      <ResponsiveContainer width={'100%'} height={425}>
        <BarChart
          data={updatedData}
          margin={{
            top: 20,
            left: -30,
          }}
          onClick={(data) => viewStore(data.activePayload[0].payload._id)}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count_app" fill="#41ad9f" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DeveloperMostApp;
