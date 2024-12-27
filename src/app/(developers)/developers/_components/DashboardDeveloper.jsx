'use client';

import './DashboardDeveloper.scss';
import { Row, Col, Spin, Button, DatePicker } from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TotalDeveloper from './total-developer/TotalDeveloper';
import DeveloperMostApp from './developer-most-app/DeveloperMostApp';
import ActivePerDeactive from './active-per-deactive/ActivePerDeactive';
import NewDeveloper from './new-developer/NewDeveloper';
import DeveloperCountry from './developer-country/DeveloperCountry';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import { useQuery } from '@tanstack/react-query';

const { RangePicker } = DatePicker;

function DashboardDeveloper() {
  const dateFormat = 'YYYY-MM-DD';
  const fromDate = useRef(dayjs().subtract(30, 'd').format(dateFormat));
  const toDate = useRef(dayjs().format(dateFormat));
  const [queryKeyDeveloper, setQueryKeyDeveloper] = useState(['dashboardDeveloper', fromDate.current, toDate.current]);

  function onChangeDateRange(dates, dateStrings) {
    if (dateStrings) {
      fromDate.current = dateStrings[0];
      toDate.current = dateStrings[1];
    }
  }

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const fetchData = async (fromDate, toDate) => {
    const [developerByDay, developerMostApps, newDeveloper, statusDeveloper, partnerCountry] = await Promise.all([
      DashboardDeveloperApiService.getDeveloperByDay(fromDate, toDate),
      DashboardDeveloperApiService.getDeveloperMostApps(fromDate, toDate),
      DashboardDeveloperApiService.getNewDevelopers(fromDate, toDate),
      DashboardDeveloperApiService.getStatusDevelopers(fromDate, toDate),
      DashboardDeveloperApiService.getMostFrequentPartnerCountry(),
    ]);
    if (
      developerByDay.code === 0 &&
      developerMostApps.code === 0 &&
      newDeveloper.code === 0 &&
      statusDeveloper.code === 0 &&
      partnerCountry.code === 0
    )
      return {
        developerByDay: developerByDay.result,
        developerMostApp: developerMostApps.result,
        newDevelopers: newDeveloper.result,
        status: statusDeveloper,
        developerCountry: partnerCountry,
      };
  };

  const { data: dataDashboard, isLoading } = useQuery({
    queryKey: queryKeyDeveloper,
    queryFn: () => fetchData(fromDate.current, toDate.current),
  });

  const searchByDate = () => {
    setQueryKeyDeveloper(['dashboardDeveloper', fromDate.current, toDate.current]);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="container dashboard developer">
        <h1 className="dashboard-title">Developers Dashboard</h1>
        <div className="dashboard-range">
          <RangePicker
            defaultValue={[dayjs(fromDate.current, dateFormat), dayjs(toDate.current, dateFormat)]}
            format={dateFormat}
            allowClear={false}
            onChange={onChangeDateRange}
            disabledDate={disabledFutureDate}
          />
          <Button type="primary" icon={<SearchOutlined />} style={{ marginLeft: '10px' }} onClick={searchByDate}>
            Search
          </Button>
        </div>
        <Row className="dashboard-content" justify="space-between">
          <Col className="content-chart-dev total-day">
            <div className="chart-title">New Developers</div>
            <div className="chart-desc">Number of new developers per day</div>
            <TotalDeveloper data={dataDashboard ? dataDashboard.developerByDay : []} />
          </Col>
          <Col className="content-chart-dev percent-chart">
            <Row>
              <Col span={24}>
                <div className="chart-title">Deactive/Active developers</div>
              </Col>
              <div className="chart-desc">Correlation of the number of Deactive and Active developers</div>
            </Row>
            <Row justify="center">
              {dataDashboard && dataDashboard.status && (
                <ActivePerDeactive
                  data={[
                    {
                      value: dataDashboard.status.total_developer_active,
                      type: 'Active',
                    },
                    {
                      value: dataDashboard.status.total_developer_deactivate,
                      type: 'Deactive',
                    },
                  ]}
                  total={dataDashboard.status.total_developer}
                />
              )}
            </Row>
          </Col>
          <Col className="content-chart-dev location-chart">
            <div className="chart-title">The developer has the most application</div>
            <DeveloperMostApp data={dataDashboard ? dataDashboard.developerMostApp : []} />
          </Col>
          <Col className="content-chart-dev location-chart">
            <div className="chart-title">List of new developers</div>
            <NewDeveloper data={dataDashboard ? dataDashboard.newDevelopers : []} />
          </Col>
          <Col className="content-chart-dev content-partner_country">
            <div className="title">Partners come from the most countries</div>
            <DeveloperCountry data={dataDashboard ? dataDashboard.developerCountry : []} />
          </Col>
        </Row>
      </div>
    </Spin>
  );
}

export default DashboardDeveloper;
