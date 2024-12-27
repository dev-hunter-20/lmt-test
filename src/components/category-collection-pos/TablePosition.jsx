'use client';

import React from 'react';
import { Col, Row, Tooltip } from 'antd';
import { UpOutlined, DownOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function TablePosition(props) {
  const data = props.data;

  return (
    <div className="header-detail-app-info-right">
      <div className={`table-categories-position ${data.length > 3 ? 'scroll-table' : ''}`}>
        <div className={`title-cate ${data.length > 3 ? 'header-bottom' : ''}`}>{props.title}</div>
        {data?.map((item, index) => {
          return (
            <div
              className="item-cate"
              key={'' + index}
              style={{
                backgroundColor: index % 2 != 0 ? '#F2F2F2' : '',
              }}
            >
              <Row gutter={[5, 12]}>
                <Col className="gutter-row" lg={{ span: 12 }} xs={{ span: 12 }}>
                  {props.isCategory ? (
                    <Tooltip title={item.category_name}>
                      <Link href={'/category/' + item.category_id} prefetch={false}>
                        <span className="ellipsis-text">{item.category_name}</span>
                      </Link>
                    </Tooltip>
                  ) : (
                    <Tooltip title={item.collection_name}>
                      <Link href={'/collection/' + item.collection_id} prefetch={false}>
                        <span className="ellipsis-text">{item.collection_name}</span>
                      </Link>
                    </Tooltip>
                  )}
                </Col>
                <Col className="gutter-row" lg={{ span: 6 }} xs={{ span: 6 }}>
                  <div>
                    {item.rank} / {props.isCategory ? item.total_apps : item.total_apps}
                    {item.before_rank && item.rank && item.before_rank - item.rank > 0 ? (
                      <span className="calular-incre " style={{ whiteSpace: 'nowrap' }}>
                        <UpOutlined /> {item.before_rank - item.rank}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                    {item.before_rank && item.rank && item.before_rank - item.rank < 0 ? (
                      <span className="calular-decre " style={{ whiteSpace: 'nowrap' }}>
                        <DownOutlined /> {item.rank - item.before_rank}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
                <Col className="gutter-row " style={{ textAlign: 'center' }} lg={{ span: 6 }} xs={{ span: 6 }}>
                  <div>
                    Page {item.page}
                    {item.before_page && item.page && item.before_page - item.page > 0 ? (
                      <span className="calular-incre">
                        <UpOutlined /> {item.before_page - item.page}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                    {item.before_page && item.page && item.before_page - item.page < 0 ? (
                      <span className="calular-decre">
                        <DownOutlined /> {item.page - item.before_page}{' '}
                      </span>
                    ) : (
                      ''
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          );
        })}
      </div>
    </div>
  );
}
