'use client';

import { Button, Col, DatePicker, Row, Spin } from 'antd';
import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import NewApps from './new-apps/NewApps';
import './DashboardApp.scss';
import ActiveDeactiveApp from './active-deactive-app/ActiveDeactiveApp';
import AppCategory from './app-category/AppCategory';
import Top10Apps from './top-apps/Top10Apps';
import DashboardApiService from '@/api-services/api/DashboardApiService';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

export default function DashboardApp() {
  const dateFormat = 'YYYY-MM-DD';
  const [fromDate, setFromDate] = useState(dayjs().subtract(30, 'd').format(dateFormat));
  const [toDate, setToDate] = useState(dayjs().format(dateFormat));
  const [queryKey, setQueryKey] = useState(['dashboardData', fromDate, toDate]);

  const fetchData = async (fromDate, toDate) => {
    const [appsByDay, statusApps, appsMostReview, appsBFS] = await Promise.all([
      DashboardApiService.getAppsByDay(fromDate, toDate),
      DashboardApiService.getStatusApps(fromDate, toDate),
      DashboardApiService.getAppsMostReview(1, 10),
      DashboardApiService.getAppsBFS(fromDate, toDate),
    ]);
    return {
      appsByDay: appsByDay.result,
      statusApps: statusApps.result[0].result,
      appsMostReview: appsMostReview.result,
      appsBFS: appsBFS.result,
    };
  };
  const { data, isLoading } = useQuery({
    queryKey: queryKey,
    queryFn: () => fetchData(fromDate, toDate),
  });

  const onChangeDateRange = (dates, dateStrings) => {
    if (dates) {
      setFromDate(dates[0].format(dateFormat));
      setToDate(dates[1].format(dateFormat));
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    setQueryKey(['dashboardData', fromDate, toDate]);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="container dashboard">
        <h1 className="dashboard-title">Application Dashboard</h1>
        <div className="dashboard-range">
          <RangePicker
            defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
            allowClear={false}
            onChange={onChangeDateRange}
            disabledDate={disabledFutureDate}
            format={dateFormat}
          />
          <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
            Search
          </Button>
        </div>
        <Row className="dashboard-content" justify="space-between">
          <Col className="content-chart apps-day">
            <NewApps appsByDay={data?.appsByDay} />
          </Col>
          <Col className="content-chart percent-chart">
            <Row>
              <Col span={24}>
                <div className="chart-title">Deactive/Active</div>
              </Col>
              <div className="chart-desc">Ratio of deactive apps to active applications</div>
            </Row>
            <Row justify="center">
              <ActiveDeactiveApp statusApps={data?.statusApps} />
            </Row>
          </Col>
          <Col className="content-chart-bfs_top location-chart">
            <div className="chart-title">Built for shopify</div>
            <div className="chart-desc">Number of applications built for shopify</div>
            <AppCategory appsBFS={data?.appsBFS} />
          </Col>
          <Col className="content-chart-bfs_top reviews-chart">
            <Top10Apps appsMostReview={data?.appsMostReview} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}
