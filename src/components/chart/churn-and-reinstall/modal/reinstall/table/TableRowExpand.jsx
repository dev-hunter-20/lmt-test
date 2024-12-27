'use client';

import { Spin, Empty } from 'antd';
import React, { useEffect, useState } from 'react';
import './TableRowExpand.scss';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { getDiffDay } from '@/utils/functions';
import dayjs from 'dayjs';

export default function TableRowExpand({ record, appId, fromDate, toDate }) {
  const [loading, setLoading] = useState(false);
  const [expandedData, setExpandedData] = useState([]);
  const [error, setError] = useState(null);

  const handleCellClick = async (id, domain) => {
    setLoading(true);
    try {
      const response = await DetailAppApiService.getDetailReinstallShopByTime(id, domain);
      setLoading(false);
      if (response && response.code === 0) {
        const result = [];
        const data = response.data;
        for (let i = 0; i < data.length - 1; i++) {
          if (i === 0 && data[i].type === 'RELATIONSHIP_INSTALLED') {
            result.push({
              ...data[i],
              install_time: convertDate(data[i].install_time),
              uninstall_time: null,
            });
          }
          if (data[i].type === 'RELATIONSHIP_UNINSTALLED' && data[i + 1].type === 'RELATIONSHIP_INSTALLED') {
            result.push({
              ...data[i],
              install_time: convertDate(data[i + 1].install_time),
              uninstall_time: convertDate(data[i].uninstall_time),
              diff: getDiffDay({ install_time: data[i + 1].install_time, uninstall_time: data[i].uninstall_time }),
            });
          } else {
            continue;
          }
        }
        setExpandedData(result);
        setError(null);
      } else {
        setError('No data found.');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred while fetching data.');
    }
  };

  const convertDate = (date) => {
    const format = 'YYYY-MM-DD HH:mm:ss';
    return dayjs.utc(date, 'ddd, DD MMM YYYY HH:mm:ss z').format(format);
  };

  useEffect(() => {
    handleCellClick(appId, record.myshopifyDomain);
  }, [record.myshopifyDomain]);

  const checkInstallTime = (installTime, fromDate, toDate) => {
    const fromTime = new Date(fromDate);
    const toTime = new Date(toDate);
    const installDate = new Date(installTime);
    return installDate >= fromTime && installDate <= toTime;
  };

  return (
    <>
      <div className="content-detail">
        <div className="table-detail-value">
          {loading ? (
            <div className="loading">
              <Spin spinning={loading} />
            </div>
          ) : error ? (
            <div className="error">
              <Empty description={error} />
            </div>
          ) : (
            <table className="styled-table">
              <thead>
                <tr>
                  <th>Name App</th>
                  <th>My Shopify Domain</th>
                  <th>Name</th>
                  <th>Install</th>
                  <th>Uninstall</th>
                  <th>Diff</th>
                  <th>Reason</th>
                </tr>
              </thead>
              <tbody>
                {expandedData.map((item, index) => (
                  <tr
                    key={index}
                    className={`${item.install_time && checkInstallTime(item.install_time, fromDate, toDate) ? 'active' : ''}`}
                  >
                    <td>{item.app.name}</td>
                    <td>{item.shop.myshopifyDomain}</td>
                    <td>{item.shop.name}</td>
                    <td>{item.install_time}</td>
                    <td>{item.uninstall_time}</td>
                    <td>{item.diff}</td>
                    <td width={'30%'}>{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
