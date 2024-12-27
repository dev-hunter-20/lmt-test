'use client';

import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MerchanGrowth({ props }) {
  const dataMerchantByDate = props.value.merchant_by_date;
  const dataMerchantByDateSelected = props.filterSelected.merchant_by_date;
  const selectedValue = props.selectedValue;
  const loading = props.loading;

  const [changedAmount, setChangedAmount] = useState(0);
  const [changedPercent, setChangedPercent] = useState(0);

  useEffect(() => {
    calculatedChangedAmount();
    calculatedChangedAmountSelected();
  }, [dataMerchantByDate, dataMerchantByDateSelected, selectedValue]);

  const calculatedChangedAmount = () => {
    if (dataMerchantByDate && dataMerchantByDate.length) {
      const firstDateAmount = dataMerchantByDate[0].merchant;
      const lastDateAmount = dataMerchantByDate[dataMerchantByDate.length - 1].merchant;
      const changedAmount = lastDateAmount - firstDateAmount;
      const changedPercent = Number(((100 * changedAmount) / firstDateAmount).toFixed(2));
      setChangedAmount(changedAmount);
      setChangedPercent(changedPercent);
    }
  };

  const calculatedChangedAmountSelected = () => {
    if (dataMerchantByDateSelected && dataMerchantByDateSelected.length) {
      const firstDateAmount = dataMerchantByDateSelected[0].merchant;
      const lastDateAmount = dataMerchantByDateSelected[dataMerchantByDateSelected.length - 1].merchant;
      const changedAmount = lastDateAmount - firstDateAmount;
      const changedPercent = Number(((100 * changedAmount) / firstDateAmount).toFixed(2));
      setChangedAmount(changedAmount);
      setChangedPercent(changedPercent);
    }
  };

  const createData = (dataMerchant) => {
    return dataMerchant.map((item) => ({
      date: item.date,
      merchant: item.merchant,
    }));
  };

  const renderChartMerchant = () => {
    const chartData = dataMerchantByDateSelected
      ? selectedValue === 'D'
        ? createData(dataMerchantByDate)
        : createData(dataMerchantByDateSelected)
      : createData(dataMerchantByDate);

    const roundedMinY = chartData.length ? chartData[0].merchant : 0;
    const minY = Math.floor(roundedMinY / 10) * 10;

    const maxY = chartData.length ? Math.ceil(Math.max(...chartData.map((item) => item.merchant)) / 10) * 10 : 0;

    return (
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 10, right: 10 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis domain={[minY, maxY]} />
          <Tooltip formatter={(value) => value.toLocaleString()} labelFormatter={(label) => label} />
          <Legend />
          <Line
            type="monotone"
            dataKey="merchant"
            name="Merchant"
            stroke="#00af9f"
            fill="#00af9f"
            activeDot={{ r: 7 }}
            strokeWidth={1.5}
            dot={{ r: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <div className="merchant-growth">
      <div className="title-chart-bar">
        <div className="title">
          <div className="sub-title">
            <div className="text-title">Merchant growth</div>
            <div className={'merchants-changed ' + (changedAmount < 0 ? 'decrease' : 'increase')}>
              {changedAmount.toLocaleString()} merchants.
            </div>
          </div>
          <div className="sub-title">
            <div className="text-title">mGrowth</div>
            <div className={'merchants-changed ' + (changedAmount < 0 ? 'decrease' : 'increase')}>
              {changedPercent.toLocaleString()}%
            </div>
          </div>
        </div>
      </div>
      <div className={`${(dataMerchantByDateSelected || dataMerchantByDate) && !loading ? 'chart' : 'chart-loading'}`}>
        {(dataMerchantByDateSelected || dataMerchantByDate) && !loading ? renderChartMerchant() : <Spin />}
      </div>
    </div>
  );
}
