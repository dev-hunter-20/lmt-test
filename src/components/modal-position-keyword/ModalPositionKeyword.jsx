'use client';

import { Button, DatePicker, Modal, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import dayjs from 'dayjs';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './ModalPositionKeyword.scss';

const CustomTooltip = ({ active, payload }) => {
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
        <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].payload.date}</p>
        {payload.map((entry, index) => (
          <div
            key={`tooltip-item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '5px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                marginRight: '8px',
              }}
            />
            <p style={{ margin: 0, fontSize: '12px' }}>{`${entry.name}: ${entry.value}`}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const { RangePicker } = DatePicker;

export default function ModalPositionKeyword(props) {
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = useRef(props.fromDate);
  const toDate = useRef(props.toDate);
  const [dateList, setDateList] = useState([]);
  const host_id = window.location.pathname.substring(5);
  const [gaKeywordByDate, setGaKeywordByDate] = useState([]);
  const [dataKeyPosition, setDataKeyPosition] = useState({ bestMatch: [], popular: [] });
  const [loading, setloading] = useState(false);
  const [hiddenSeries, setHiddenSeries] = useState({ bestMatch: false, popular: false });

  const renderGaData = (gaKeywordByDate) => {
    const keywordSelected = gaKeywordByDate.find((item) => item.keyword === props.keywordName).ga_keyword_by_date;
    return keywordSelected ? keywordSelected : [];
  };

  const createDataChart = (keywordPosition, gaKeywordByDate, labels) => {
    return labels.map((item) => {
      const currentUEvents = gaKeywordByDate.find((key) => key.date === item);
      const currentUPageView = gaKeywordByDate.find((key) => key.date === item);
      const currentBestMatch = keywordPosition.bestMatch.find((key) => key.date === item);
      const currentPopular = keywordPosition.popular.find((key) => key.date === item);

      return {
        date: item,
        bestMatch: hiddenSeries.bestMatch ? null : currentBestMatch ? currentBestMatch.value : null,
        popular: hiddenSeries.popular ? null : currentPopular ? currentPopular.value : null,
        uniqueEvents: hiddenSeries.uniqueEvents ? null : currentUEvents ? currentUEvents.uniqueEvents : null,
        uniquePageviews: hiddenSeries.uniquePageviews
          ? null
          : currentUPageView
          ? currentUPageView.uniquePageviews
          : null,
      };
    });
  };

  const setDates = (fromDate, toDate) => {
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const dates = [];
    while (startDate <= endDate) {
      dates.push(startDate.toISOString().split('T')[0]);
      startDate.setDate(startDate.getDate() + 1);
    }
    setDateList(dates);
  };

  const asyncFetch = async (id, fromDate, toDate) => {
    setloading(true);
    try {
      const [positionPopular, positionBestMatch, dataGa] = await Promise.all([
        DetailAppApiService.getPositionKeywordChangeByLang(
          host_id === id ? id : host_id,
          props.language,
          'popular',
          fromDate,
          toDate,
          host_id === id ? '' : id,
        ),
        DetailAppApiService.getPositionKeywordChangeByLang(
          host_id === id ? id : host_id,
          props.language,
          'best_match',
          fromDate,
          toDate,
          host_id === id ? '' : id,
        ),
        DetailAppApiService.getPositionKeywordByLang(
          host_id === id ? id : host_id,
          'uk',
          fromDate,
          toDate,
          host_id === id ? '' : id,
        ),
      ]);

      if (positionPopular && positionPopular.code === 0) {
        setDataKeyPosition({
          popular: positionPopular.data.filter((item) => item.type === props.keywordName),
          bestMatch: positionBestMatch.data.filter((item) => item.type === props.keywordName),
        });
        setGaKeywordByDate(renderGaData(dataGa.data.result));
      }
    } catch (error) {
      console.error('Unable to get data.', error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    asyncFetch(props.appId, fromDate.current, toDate.current);
    setDates(fromDate.current, toDate.current);
  }, []);

  const dataChart = useMemo(() => {
    return createDataChart(dataKeyPosition, gaKeywordByDate, dateList);
  }, [dataKeyPosition, gaKeywordByDate, dateList, hiddenSeries]);

  const handleLegendClick = (e) => {
    setHiddenSeries((prevState) => ({
      ...prevState,
      [e.dataKey]: !prevState[e.dataKey],
    }));
  };

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const searchByDate = () => {
    setDates(fromDate.current, toDate.current);
    asyncFetch(props.appId, fromDate.current, toDate.current);
  };

  function onChangeDateRange(dates, dateStrings) {
    if (dateStrings) {
      fromDate.current = dateStrings[0];
      toDate.current = dateStrings[1];
    }
  }

  return (
    <Modal
      width={'60%'}
      title="Detail position keyword"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <div className="popup-detail-position">
        <div className="date-range">
          {fromDate && toDate ? (
            <>
              <RangePicker
                defaultValue={[dayjs(fromDate.current, dateFormat), dayjs(toDate.current, dateFormat)]}
                format={dateFormat}
                allowClear={false}
                onChange={onChangeDateRange}
              />
              <Button
                type="primary"
                loading={loading}
                icon={<SearchOutlined />}
                className="icon-search-date"
                onClick={searchByDate}
              >
                Search
              </Button>
            </>
          ) : (
            ''
          )}
        </div>
        <div className="chart-weekly-keyword">
          {loading ? (
            <Spin />
          ) : (
            <ResponsiveContainer width="100%" height={600}>
              <ComposedChart data={dataChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  label={{
                    value: 'Unique Pageviews & Events',
                    angle: -90,
                    position: 'insideLeft',
                    offset: 0,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{
                    value: 'Best Match & Popular',
                    angle: -90,
                    position: 'insideRight',
                    offset: 0,
                    style: { textAnchor: 'middle' },
                  }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  onClick={handleLegendClick}
                  formatter={(value, entry) => (
                    <span
                      style={{
                        textDecoration: hiddenSeries[entry.dataKey] ? 'line-through' : 'none',
                        color: '#000000',
                        cursor: 'pointer',
                      }}
                    >
                      {value}
                    </span>
                  )}
                />
                <Bar yAxisId="left" dataKey="uniquePageviews" name={'Unique Pageviews'} fill="#4bc0c0" />
                <Bar yAxisId="left" dataKey="uniqueEvents" name={'Unique Events'} fill="#3584eb" />
                <Line
                  yAxisId="right"
                  type="monotone"
                  name="Best Match"
                  dataKey="bestMatch"
                  stroke="#cc3300"
                  dot={true}
                  strokeDasharray={hiddenSeries.bestMatch ? '5 5' : '0'}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  name="Popular"
                  dataKey="popular"
                  stroke="#f5ae3d"
                  dot={true}
                  strokeDasharray={hiddenSeries.popular ? '5 5' : '0'}
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </Modal>
  );
}
