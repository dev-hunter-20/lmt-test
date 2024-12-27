'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import { Empty } from 'antd';
import './GrowthReview.scss';
import { CustomTooltip } from '../most-review/MostReview';

export default function GrowthReview(props) {
  const createData = (data) => {
    return data
      .slice()
      .reverse()
      .map((item) => ({
        app_name: item.app_name,
        review_count: item.review_count,
      }));
  };

  const data = useMemo(() => createData(props.data), [props.data]);

  return (
    <div className="growth-review_chart">
      {data && data.length > 0 ? (
        <ResponsiveContainer width="100%" height={370}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="app_name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="review_count"
              name="Review count"
              stroke="#41ad9f"
              fill="#41ad9f"
              activeDot={{ r: 8 }}
              strokeWidth={1.5}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Empty description="No Data Available" className="empty-nodata" />
      )}
    </div>
  );
}
