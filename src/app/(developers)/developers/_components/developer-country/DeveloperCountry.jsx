'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { country, count } = payload[0].payload;
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
        <p style={{ fontWeight: 'bold' }}>{country}</p>
        <p style={{ margin: 0, fontSize: '12px' }}>{`Count: ${count}`}</p>
      </div>
    );
  }

  return null;
};

export default function DeveloperCountry(props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(!props.data || !props.data.result);
  }, [props.data]);

  const data = useMemo(
    () =>
      props.data && props.data.result
        ? props.data.result.map((item) => ({
            country: item._id,
            count: item.count,
          }))
        : [],
    [props.data],
  );

  return (
    <div className="dashboard-developer_country">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data.sort((a, b) => b.count - a.count)} layout="vertical" margin={{ top: 10, left: -70 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={true} />
            <XAxis type="number" />
            <YAxis dataKey="country" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" fill="#41ad9f" barSize={20}>
              <LabelList dataKey="count" position="inside" style={{ fill: '#ffffff', fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
