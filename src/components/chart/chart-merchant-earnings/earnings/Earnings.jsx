'use client';

import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Spin, Tooltip as TooltipTitle } from 'antd';
import { ArrowDownOutlined, ArrowUpOutlined } from '@ant-design/icons';

export default function Earnings({ props }) {
  const dataEarningByDate = props.value.earning_by_date;
  const dataEarningByDateSelected = props.filterSelected.earning_by_date;
  const dataSelectedTotalEarning = props.filterSelected.total_earning;
  const dataSelectedTotalEarningBefore = props.filterSelected.total_earning_before;
  const selectedValue = props.selectedValue;

  const [hiddenItems, setHiddenItems] = useState({
    earning: false,
    aufc: false,
  });

  const createDataChartEarning = (dataEarning) => {
    if (!dataEarning) return [];

    const labels = [];
    dataEarning.forEach((item) => {
      if (!labels.includes(item.date)) labels.push(item.date);
    });

    labels.sort((a, b) => (a > b ? 1 : -1));

    return labels.map((item) => {
      const data = dataEarning.find((val) => val.date === item);
      return {
        date: item,
        earning: data.amount || 0,
        activeCharge: data.active_charge || 0,
        cancelCharge: data.cancel_charge || 0,
        frozenCharge: data.frozen_charge || 0,
        unfrozenCharge: data.unfrozen_charge || 0,
        aufc:
          (data.active_charge || 0) +
          (data.unfrozen_charge || 0) -
          (data.frozen_charge || 0) -
          (data.cancel_charge || 0),
      };
    });
  };

  let dataColumn = dataEarningByDateSelected
    ? selectedValue === 'D'
      ? createDataChartEarning(dataEarningByDate)
      : createDataChartEarning(dataEarningByDateSelected)
    : createDataChartEarning(dataEarningByDate);

  const handleLegendClick = (dataKey) => {
    setHiddenItems((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const renderAUFC = (data) => {
    if (!data) {
      return null;
    }

    const items = [
      { title: 'Active Charge', value: data.activeCharge || 0, color: '#3fc2f0' },
      { title: 'Charge Unfrozen', value: data.unfrozenCharge || 0, color: '#329ac5' },
      { title: 'Charge Frozen', value: data.frozenCharge || 0, color: '#f56256' },
      { title: 'Canceled Charge', value: data.cancelCharge || 0, color: '#cc3399' },
    ];

    return (
      <ul style={{ paddingLeft: '10px', margin: 0 }}>
        {items.map((item, index) => (
          <li
            style={{
              lineHeight: '20px',
              fontSize: '13px',
              marginTop: '6px',
              color: item.color,
            }}
            key={index}
          >
            <span>{item.title}: </span>
            <span>{parseFloat(Number(item.value).toFixed(2))}</span>
          </li>
        ))}
      </ul>
    );
  };

  const CustomTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const items = payload.map((item) => ({
        name: item.name,
        value: item.value,
        color: item.fill,
        data: item.payload,
      }));

      return (
        <div style={{ padding: '10px', backgroundColor: 'white', border: '1px solid #ddd' }}>
          <p>{label}</p>
          <ul style={{ paddingLeft: '10px', marginBottom: 0 }}>
            {items.map((item, index) => (
              <li
                style={{
                  lineHeight: '25px',
                  color: item.color,
                  fontSize: '14px',
                }}
                key={index}
              >
                <span>{item.name}</span>: <span>{parseFloat(Number(item.value).toFixed(2))}</span>
              </li>
            ))}
          </ul>
          {items.length > 0 && renderAUFC(items[0].data)}
        </div>
      );
    }

    return null;
  };

  const getPercentGrowth = (total, totalBefore) => {
    if (totalBefore === 0) {
      return null;
    }

    if (total - totalBefore > 0) {
      return (
        <span className="increase" title="Earning Growth">
          <ArrowUpOutlined />
          {(((total - totalBefore) / totalBefore) * 100).toFixed(2)}%
        </span>
      );
    }
    return (
      <span className="decrease" title="Earning Growth">
        <ArrowDownOutlined />
        {(((totalBefore - total) / totalBefore) * 100).toFixed(2)}%
      </span>
    );
  };

  const renderDiffDay = (data = []) => {
    if (data.length === 1) {
      return 'Yesterday';
    }
    if (selectedValue === 'W') {
      return `Last ${data.length} Weeks`;
    } else if (selectedValue === 'M') {
      return `Last ${data.length} Months`;
    } else if (selectedValue === 'Q') {
      return `Last ${data.length} Quarters`;
    } else if (selectedValue === 'Y') {
      return `Last ${data.length - 1} Years`;
    }
    return `Last ${data.length} Days`;
  };

  const renderTotalEarnings = () => {
    return (
      <>
        {dataSelectedTotalEarning ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                ${props.value.total_earning ? Math.round(props.value.total_earning).toLocaleString() : ''}{' '}
                {getPercentGrowth(props.value.total_earning, props.value.total_earning_before)}
              </span>
            ) : (
              <span>
                ${dataSelectedTotalEarning ? Math.round(dataSelectedTotalEarning).toLocaleString() : ''}{' '}
                {getPercentGrowth(dataSelectedTotalEarning, dataSelectedTotalEarningBefore)}
              </span>
            )}
          </>
        ) : (
          <span>
            ${props.value.total_earning ? Math.round(props.value.total_earning).toLocaleString() : ''}{' '}
            {getPercentGrowth(props.value.total_earning, props.value.total_earning_before)}
          </span>
        )}
      </>
    );
  };

  const renderEarningTime = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span className="text-title">{renderDiffDay(dataEarningByDate)}</span>
            ) : (
              <span className="text-title">{renderDiffDay(dataEarningByDateSelected)}</span>
            )}
          </>
        ) : (
          <span className="text-title">{renderDiffDay(dataEarningByDate)}</span>
        )}
      </>
    );
  };

  const renderEarningTimesTotal = () => {
    return (
      <>
        {dataSelectedTotalEarningBefore ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                ${props.value.total_earning_before ? Math.round(props.value.total_earning_before).toLocaleString() : ''}{' '}
              </span>
            ) : (
              <span>
                ${dataSelectedTotalEarningBefore ? Math.round(dataSelectedTotalEarningBefore).toLocaleString() : ''}{' '}
              </span>
            )}
          </>
        ) : (
          <span>
            ${props.value.total_earning_before ? Math.round(props.value.total_earning_before).toLocaleString() : ''}{' '}
          </span>
        )}
      </>
    );
  };

  const renderEarningAC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.active_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCU = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate
                        .map((item) => item.unfrozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.unfrozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.unfrozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCF = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.frozen_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningCC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.cancel_charge)
                        .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningAUFC = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(
                      dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0) +
                        dataEarningByDate
                          .map((item) => item.unfrozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDate
                          .map((item) => item.frozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDate
                          .map((item) => item.cancel_charge)
                          .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(
                      dataEarningByDateSelected
                        .map((item) => item.active_charge)
                        .reduce((partialSum, a) => partialSum + a, 0) +
                        dataEarningByDateSelected
                          .map((item) => item.unfrozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDateSelected
                          .map((item) => item.frozen_charge)
                          .reduce((partialSum, a) => partialSum + a, 0) -
                        dataEarningByDateSelected
                          .map((item) => item.cancel_charge)
                          .reduce((partialSum, a) => partialSum + a, 0),
                    ).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate
              ? Math.round(
                  dataEarningByDate.map((item) => item.active_charge).reduce((partialSum, a) => partialSum + a, 0) +
                    dataEarningByDate.map((item) => item.unfrozen_charge).reduce((partialSum, a) => partialSum + a, 0) -
                    dataEarningByDate.map((item) => item.frozen_charge).reduce((partialSum, a) => partialSum + a, 0) -
                    dataEarningByDate.map((item) => item.cancel_charge).reduce((partialSum, a) => partialSum + a, 0),
                ).toLocaleString()
              : ''}
          </span>
        )}
      </>
    );
  };

  const renderEarningAEPD = () => {
    return (
      <>
        {dataEarningByDateSelected ? (
          <>
            {selectedValue === 'D' ? (
              <span>
                $
                {dataEarningByDate
                  ? Math.round(props.value.total_earning / dataEarningByDate.length).toLocaleString()
                  : ''}
              </span>
            ) : (
              <span>
                $
                {dataEarningByDateSelected
                  ? Math.round(props.value.total_earning / dataEarningByDateSelected.length).toLocaleString()
                  : ''}
              </span>
            )}
          </>
        ) : (
          <span>
            $
            {dataEarningByDate ? Math.round(props.value.total_earning / dataEarningByDate.length).toLocaleString() : ''}
          </span>
        )}
      </>
    );
  };

  return (
    <div className="earnings">
      <div className="title-chart-bar">
        <div className="title-chart-bar-item">
          <div className="title">
            <span className="text-title">Earnings</span>
          </div>
          <div className="total-earning">{renderTotalEarnings()}</div>
        </div>
        {props.value.total_earning_before > 0 && (
          <div className="title-chart-bar-item">
            <div className="title">
              <TooltipTitle title="Earnings">{renderEarningTime()}</TooltipTitle>
            </div>
            <div className="total-earning text-total">{renderEarningTimesTotal()}</div>
          </div>
        )}
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Active Charge">
              <span className="text-title">AC</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningAC()}</div>
        </div>
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Charge Unfrozen">
              <span className="text-title">CU</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningCU()}</div>
        </div>
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Charge Frozen">
              <span className="text-title">CF</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningCF()}</div>
        </div>
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Canceled Charge">
              <span className="text-title">CC</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningCC()}</div>
        </div>
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Active + Unfrozen - Canceled - Frozen">
              <span className="text-title">AUFC</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningAUFC()}</div>
        </div>
        <div className="title-chart-bar-item">
          <div className="title">
            <TooltipTitle title="Avg. Earning per Day">
              <span className="text-title">AEPD</span>
            </TooltipTitle>
          </div>
          <div className="total-earning">{renderEarningAEPD()}</div>
        </div>
      </div>
      <div className={`${dataColumn && !props.loading ? 'chart' : 'chart-loading'}`}>
        {dataColumn && !props.loading ? (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={dataColumn} margin={{ top: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} horizontal={true} />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltipContent />} />
              <Legend
                onClick={(e) => handleLegendClick(e.dataKey)}
                formatter={(value, entry) => (
                  <span
                    style={{
                      textDecoration: hiddenItems[entry.dataKey] ? 'line-through' : 'none',
                      fontSize: '12px',
                      color: '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              <Bar dataKey="earning" name={'Earning'} fill="#41ad9f" barSize={30} hide={hiddenItems.earning} />
              <Bar dataKey="aufc" name={'AC + UC - CF - CC'} fill="#3399ff" barSize={30} hide={hiddenItems.aufc} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Spin />
        )}
      </div>
    </div>
  );
}
