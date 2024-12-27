'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Spin, Breadcrumb } from 'antd';
import { message, Pagination } from 'antd';
import { getParameterQuery, encodeQueryParams } from '@/utils/functions';
import { ArrowLeftOutlined, StarFilled } from '@ant-design/icons';
import ModalListApp from './ModalListApp';
import './TableListDeveloper.scss';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

function TableListDeveloper() {
  const params = getParameterQuery();
  const date = params.date;
  const [loading, setLoading] = useState(false);
  const [listDevelopers, setListDevelopers] = useState([]);
  const page = params.page ? params.page : 1;
  const perPage = params.per_page ? params.per_page : 20;
  const [currentPage, setCurrentPage] = useState(page);
  const [numberPage, setNumberPage] = useState(perPage);
  const [total, setTotal] = useState();
  const [showApps, setShowApps] = useState(false);
  const idDeveloper = useRef();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const onChangePage = (page, per_page, date) => {
    let newParams = {
      ...params,
      page,
      per_page,
    };
    window.history.replaceState(null, null, `${window.location.pathname}?${encodeQueryParams(newParams)}`);
    asyncFetch(page, per_page, date);
  };

  const asyncFetch = async (page, per_page, date) => {
    setLoading(true);
    const result = await DashboardDeveloperApiService.getDeveloperByDate(page, per_page, date);
    setLoading(false);
    if (result && result.code == 0) {
      setListDevelopers(result.result);
      setCurrentPage(result.current_page);
      setTotal(result.total);
      return;
    }
    message.error(result.message);
  };

  useEffect(() => {
    asyncFetch(page, perPage, date);
  }, []);

  const handleCancel = () => {
    setShowApps(false);
  };

  return (
    <Spin spinning={loading}>
      <div className="detail-developers-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              <Link prefetch={false} href={'/developers'}>
                Developers dashboard
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">{date || ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="detail-categories">
        {showApps && <ModalListApp id={idDeveloper.current} handleCancel={handleCancel} />}
        <div className="detail-categories-body container">
          <div className="container-title-body">
            <div className="wrapper-title">
              <h1 className="title">{date}</h1>
              <div className="title-apps">{total} Developers</div>
            </div>
          </div>
          <div className="line-top"></div>
          <div className="detail-category">
            <div className="title-column">
              <Row>
                <Col className="title-styled" span={5}>
                  Name
                </Col>
                <Col className="title-styled" span={5}>
                  Applications
                </Col>
                <Col className="title-styled" span={4}>
                  Date
                </Col>
                <Col className="title-styled" span={5}>
                  Reviews
                </Col>
                <Col className="title-styled" span={5}>
                  Avg Rating
                </Col>
              </Row>
            </div>
            {listDevelopers
              ? listDevelopers.map((itemChild, index) => {
                  return (
                    <div
                      className="item-detail"
                      key={'' + index}
                      style={{
                        backgroundColor: '#fff',
                      }}
                    >
                      <Row>
                        <Col span={5}>
                          <Link prefetch={false} href={`/developer/${itemChild._id}`}>
                            {itemChild.name}
                          </Link>
                        </Col>
                        <Col span={5}>
                          <Link
                            href={'#'}
                            onClick={() => {
                              setShowApps(true);
                              idDeveloper.current = itemChild._id;
                            }}
                            prefetch={false}
                          >
                            {`${itemChild.apps}${itemChild.count_app > 1 ? ' apps' : ' app'}`}
                          </Link>
                        </Col>
                        <Col span={4}>
                          <div>{itemChild.date}</div>
                        </Col>
                        <Col span={5}>
                          <div>{itemChild.review_count || ''}</div>
                        </Col>
                        <Col span={5}>
                          <div className="icon-star">
                            {itemChild.avg_star ? itemChild.avg_star : ''}
                            {itemChild.avg_star ? (
                              <span>
                                <StarFilled
                                  style={{
                                    marginLeft: '3px',
                                    color: '#ffc225',
                                  }}
                                />
                              </span>
                            ) : (
                              ''
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  );
                })
              : ''}
          </div>
          {total > 0 ? (
            <div className="pagination">
              <Pagination
                pageSize={numberPage}
                current={currentPage}
                onChange={(page, pageSize) => {
                  setCurrentPage(page);
                  setNumberPage(pageSize);
                  onChangePage(page, pageSize, date);
                }}
                total={total}
                showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} developers`}
              />
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    </Spin>
  );
}
export default TableListDeveloper;
