'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import { options } from '@/utils/FilterOption';
import { encodeQueryParams, getParameterQuery, renderFilterDropdown } from '@/utils/functions';
import { Card, Col, Menu, Pagination, Row, Spin } from 'antd';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ModalDetailApps from './modal/ModalDetailApps';
import './AppListing.scss';

export default function AppListing() {
  const [data, setData] = useState([]);
  const params = getParameterQuery();
  const page = params.page ? parseInt(params.page) : 1;
  const perPage = params.per_page ? parseInt(params.per_page) : 24;
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [sortBy, setSortBy] = useState('newest');
  const [showDetail, setShowDetail] = useState(false);
  const [total, setTotal] = useState();
  const id = useRef();

  useEffect(() => {
    fetchData(page, perPage, sortBy);
  }, [sortBy]);

  const onChangePage = (page, per_page) => {
    fetchData(page, per_page, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  async function fetchData(page, per_page, sort_by) {
    setIsLoading(true);
    let result = await DashboardApiService.getIntegrations(page, per_page, sort_by);
    if (result) {
      setData(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total_app);
    }
    setIsLoading(false);
  }

  const onClickShow = (value) => {
    setShowDetail(true);
    id.current = value;
  };

  const handleCancel = () => {
    setShowDetail(false);
  };

  const renderOption = (options) => {
    return (
      <Menu>
        {options.map((item, index) => (
          <Menu.Item key={index} onClick={() => setSortBy(item.value)}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Spin spinning={isLoading}>
      {showDetail && <ModalDetailApps name={id.current} handleCancel={handleCancel} />}
      <div className="integration">
        <div className="integration-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">Integration Capabilities</h1>
              <div className="title-apps">{total ? total.toLocaleString() : ''} Integration Capabilities</div>
            </div>
          </div>
        </div>
      </div>
      <div className="container content">
        <Row className="integrations">
          {data &&
            data.map((item) => (
              <Col className="integrations-card" key={item._id}>
                <Card
                  title={<div className="integrations-title">{item._id}</div>}
                  extra={<a onClick={() => onClickShow(item._id)}>View Apps</a>}
                >
                  <div className="flex items-center integrations-content">
                    <Image src="/image/integration.webp" alt="" width={20} height={20} />
                    Number of applications: <span style={{ fontWeight: 500 }}>{item.count}</span>
                  </div>
                </Card>
              </Col>
            ))}
        </Row>
        {total > 0 ? (
          <div className="pagination">
            <Pagination
              pageSize={numberPage}
              current={currentPage}
              onChange={(page, pageSize) => {
                setCurrentPage(page);
                setNumberPage(pageSize);
                onChangePage(page, pageSize);
              }}
              total={total}
              showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} Integration Capabilities`}
              pageSizeOptions={[24, 48, 96, 192].map(String)}
            />
          </div>
        ) : (
          ''
        )}
      </div>
    </Spin>
  );
}
