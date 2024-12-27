'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './EarningByPlan.scss';
import { capitalize } from 'lodash';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.8;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="middle">
      {`$${value.toLocaleString('en-US')}`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const color = payload[0].payload.fill;
    const { name, value } = payload[0].payload;
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
        <p style={{ margin: 0, fontSize: '12px' }}>{`${name}: $${value.toLocaleString('en-US')}`}</p>
      </div>
    );
  }

  return null;
};

export default function EarningByPlan(props) {
  const value = props.value.earning_by_pricing;
  const [hiddenItems, setHiddenItems] = useState([]);

  // Process data for the pie chart
  const dataChart = useMemo(() => {
    const dataPlan = value
      ? value
          .filter((item) => item.count && item.price_name !== 'MONTHLY PAYMENT' && item.price_name !== 'YEARLY PAYMENT')
          .map((item) => {
            return {
              name: item ? (item.price !== 'other' ? item.price_name + ' - ' + capitalize(item.type) : 'Other') : '',
              value: item.count * item.price.toFixed(0),
            };
          })
      : [];

    const sumOtherMonthly = value
      .filter((item) => item.price_name === 'MONTHLY PAYMENT')
      .reduce((acc, item) => acc + item.count * item.price.toFixed(0), 0);

    const sumOtherYearly = value
      .filter((item) => item.price_name === 'YEARLY PAYMENT')
      .reduce((acc, item) => acc + item.count * item.price.toFixed(0), 0);

    const dataOtherPlan = [
      sumOtherMonthly
        ? {
            name: 'Other - Monthly',
            value: sumOtherMonthly,
          }
        : null,
      sumOtherYearly
        ? {
            name: 'Other - Yearly',
            value: sumOtherYearly,
          }
        : null,
    ].filter(Boolean);

    return [...dataPlan, ...dataOtherPlan];
  }, [value]);

  const visibleData = dataChart.filter((item) => !hiddenItems.includes(item.name));

  const handleLegendClick = (itemName) => {
    setHiddenItems((prev) =>
      prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
    );
  };

  const COLORS = ['#663399', '#3CB371', '#FFBB28', '#FF8042', '#4169E1', '#A0522D'];

  // Calculate totals
  const getTotalMerchants = (value) => {
    return value
      ? value.filter((item) => item.type !== 'other').reduce((accumulator, item) => accumulator + item.count, 0)
      : 0;
  };

  const getTotalRev = (value) => {
    return value
      ? value.filter((item) => item.type !== 'other').reduce((acc, item) => acc + item.count * item.price, 0)
      : 0;
  };

  // Prepare data for the table
  const data = useMemo(() => {
    const dataMonthly = value ? value.filter((item) => item.type === 'monthly') : [];
    const dataYearly = value ? value.filter((item) => item.type === 'yearly') : [];
    const sumCount = value
      ? value
          .filter((item) => item.type !== 'other')
          .reduce((accumulator, item) => accumulator + item.price * item.count, 0)
      : 0;

    const getPricePlan = (plans) => {
      const uniquePrices = {};
      return plans
        ? plans
            .filter((item) => item.type !== 'other')
            .filter((element) => {
              const { price_monthly } = element;
              if (uniquePrices[price_monthly]) {
                return false;
              }
              uniquePrices[price_monthly] = true;
              return true;
            })
        : [];
    };

    return getPricePlan(value).map((item) => {
      const yearly = dataYearly.find((ele) => ele.price_monthly === item.price_monthly);
      const monthly = dataMonthly.find((ele) => ele.price_monthly === item.price_monthly);
      return {
        price: item ? `$${item.price_monthly}` : ' ',
        merchants_yearly: yearly ? yearly.count : 0,
        merchants_monthly: monthly ? monthly.count : 0,
        rev_yearly: yearly ? Math.round(yearly.count * yearly.price) : 0,
        rev_monthly: monthly ? Math.round(monthly.count * monthly.price_monthly) : 0,
        percent_yearly: yearly ? `${(((yearly.count * yearly.price) / sumCount) * 100).toFixed(2)}%` : 0,
        percent_monthly: monthly ? `${(((monthly.count * monthly.price_monthly) / sumCount) * 100).toFixed(2)}%` : 0,
      };
    });
  }, [value]);

  const truncateLabel = (label, maxLength = 20) => {
    if (label.length > maxLength) {
      return label.substring(0, maxLength) + '...';
    }
    return label;
  };

  return (
    <div className="row-earning">
      <div className="title-earning">
        <span>Active Charge by Plans</span>
      </div>
      <div className="content-earning">
        <div className="table-earning-value">
          <table className="styled-table">
            <thead>
              <tr>
                <th rowSpan={2} className="thead-parent">
                  Price Plan
                </th>
                <th colSpan={3} className="thead-parent text-center">
                  Monthly
                </th>
                <th colSpan={3} className="text-center" style={{ fontSize: '18px' }}>
                  Yearly
                </th>
              </tr>
              <tr>
                <th>Merchants</th>
                <th>Revenue</th>
                <th>%</th>
                <th>Merchants</th>
                <th>Revenue</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: 'bold' }}>{item.price || ' '}</td>
                    <td>{item.merchants_monthly ? item.merchants_monthly.toLocaleString('en-US') : ' '}</td>
                    <td>{item.rev_monthly ? `$${Math.round(item.rev_monthly).toLocaleString('en-US')}` : ' '}</td>
                    <td>{item.percent_monthly || ' '}</td>
                    <td>{item.merchants_yearly || ' '}</td>
                    <td>{item.rev_yearly ? `$${Math.round(item.rev_yearly).toLocaleString('en-US')}` : ' '}</td>
                    <td>{item.percent_yearly || ' '}</td>
                  </tr>
                ))}
              <tr className="sum-row">
                <td>
                  <p>Sum</p>
                  <p>Percent</p>
                </td>
                <td>
                  <p>{data.reduce((acc, item) => acc + item.merchants_monthly, 0).toLocaleString('en-US')}</p>
                  <p>
                    {((data.reduce((acc, item) => acc + item.merchants_monthly, 0) / getTotalMerchants(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td>
                  <p>${data.reduce((acc, item) => acc + item.rev_monthly, 0).toLocaleString('en-US')}</p>
                  <p>
                    {((data.reduce((acc, item) => acc + item.rev_monthly, 0) / getTotalRev(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td></td>
                <td>
                  <p>{data.reduce((acc, item) => acc + item.merchants_yearly, 0).toLocaleString('en-US')}</p>
                  <p>
                    {((data.reduce((acc, item) => acc + item.merchants_yearly, 0) / getTotalMerchants(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td>
                  <p>${data.reduce((acc, item) => acc + item.rev_yearly, 0).toLocaleString('en-US')}</p>
                  <p>
                    {((data.reduce((acc, item) => acc + item.rev_yearly, 0) / getTotalRev(value)) * 100)
                      .toFixed(2)
                      .toLocaleString('en-US')}
                    %
                  </p>
                </td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="percent-chart">
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={visibleData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={130}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {visibleData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    opacity={hiddenItems.includes(entry.value) ? 0.3 : 1}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                onClick={(e) => handleLegendClick(e.value)}
                payload={dataChart.map((item, index) => ({
                  id: item.name,
                  value: item.name,
                  type: 'square',
                  color: COLORS[index % COLORS.length],
                  inactive: hiddenItems.includes(item.name),
                }))}
                formatter={(value, entry) => {
                  return (
                    <span
                      style={{
                        textDecoration: hiddenItems.includes(entry.id) ? 'line-through' : 'none',
                        fontSize: '12px',
                        color: '#000000',
                        cursor: 'pointer',
                      }}
                    >
                      {truncateLabel(value)}
                    </span>
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
