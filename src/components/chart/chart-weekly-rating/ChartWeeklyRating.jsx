'use client';

import React, { useMemo } from 'react';
import { Empty, Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ChartWeeklyRating.scss';

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

export default function ChartWeeklyRating(props) {
  const nameApp = props?.infoApp?.data?.detail?.name || ' ';

  const dataConvert = useMemo(() => {
    if (props.value) {
      return props.value;
    }
  }, [props.value]);

  const chartData = dataConvert
    ? dataConvert.labels.map((label, index) => {
        const chartItem = { x: label };
        dataConvert.datasets.forEach((dataset) => {
          chartItem[dataset.label] = dataset.data[index];
        });
        return chartItem;
      })
    : [];

  const calculateReviewChange = () => {
    if (chartData.length > 0) {
      const firstReviewCount = chartData[0].Review;
      const lastReviewCount = chartData[chartData.length - 1].Review;
      const reviewChange = lastReviewCount - firstReviewCount;

      // Convert x to Date objects
      const firstDate = new Date(chartData[0].x);
      const lastDate = new Date(chartData[chartData.length - 1].x);

      // Calculate the difference in days
      const diffTime = Math.abs(lastDate - firstDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (reviewChange > 0) {
        return {
          message: (
            <>
              {<strong>{nameApp}</strong>} has gained <strong>{reviewChange}</strong> new reviews in the past{' '}
              <strong>{diffDays}</strong> days.
            </>
          ),
        };
      } else if (reviewChange === 0) {
        return {
          message: (
            <>
              {<strong>{nameApp}</strong>} has maintained the same number of reviews over the past{' '}
              <strong>{diffDays}</strong> days.
            </>
          ),
        };
      }
    }

    return null;
  };

  const calculateRatingChange = () => {
    if (chartData.length > 0) {
      const firstRating = chartData[0].star;
      const lastRating = chartData[chartData.length - 1].star;

      // Convert x to Date objects
      const firstDate = new Date(chartData[0].x);
      const lastDate = new Date(chartData[chartData.length - 1].x);

      // Calculate the difference in days
      const diffTime = Math.abs(lastDate - firstDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (firstRating !== lastRating) {
        return {
          message: (
            <>
              {<strong>{nameApp}</strong>} rating has changed from <strong>{firstRating}</strong> to{' '}
              <strong>{lastRating}</strong> in the past <strong>{diffDays}</strong> days.
            </>
          ),
        };
      } else {
        return {
          message: (
            <>
              {<strong>{nameApp}</strong>} rating has no change in the past <strong>{diffDays}</strong> days.
            </>
          ),
        };
      }
    }

    return null;
  };

  const reviewChangeInfo = useMemo(() => calculateReviewChange(), [dataConvert, nameApp]);
  const ratingChangeInfo = useMemo(() => calculateRatingChange(), [dataConvert, nameApp]);

  return (
    <>
      {!props.onDashboard && (
        <div className="block-header-review">
          {props.isReview ? (
            <>
              Review Changes
              {reviewChangeInfo && <span className="review-message">{reviewChangeInfo.message}</span>}
            </>
          ) : (
            <>
              Rating Changes
              {ratingChangeInfo && <span className="review-message">{ratingChangeInfo.message}</span>}
            </>
          )}
        </div>
      )}
      <div className={`${props.loading ? 'chart-loading' : 'chart'}`}>
        {props.loading ? (
          <Spin />
        ) : chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis
                domain={props.isReview ? undefined : [0, 5]}
                ticks={props.isReview ? undefined : [0, 1, 2, 3, 4, 5]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                formatter={(value) => {
                  const formattedValue = value.charAt(0).toUpperCase() + value.slice(1);
                  return (
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#000000',
                      }}
                    >
                      {formattedValue}
                    </span>
                  );
                }}
              />
              {dataConvert.datasets.map((dataset, index) => (
                <Line
                  key={index}
                  type="monotone"
                  dataKey={dataset.label}
                  stroke={dataset.borderColor}
                  fill={dataset.backgroundColor}
                  activeDot={{ r: 7 }}
                  strokeWidth={1.5}
                  dot={{ r: 2 }}
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
