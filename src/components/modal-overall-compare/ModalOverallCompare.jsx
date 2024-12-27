'use client';

import { Modal, Table, Tooltip } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { CheckOutlined, CloseOutlined, StarFilled } from '@ant-design/icons';
import Image from 'next/image';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import './ModalOverallCompare.scss';

export default function ModalOverallCompare(props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const asyncFetch = async (id) => {
    setLoading(true);
    const result = await DetailAppApiService.getDataCompetitor(id);
    setLoading(false);
    if (result && result.code == 0) {
      setData([result.data[0].app_host, ...result.data[1].app_compare]);
    }
  };

  const columns = useMemo(() => {
    return data
      ? [
          {
            title: '',
            dataIndex: 'param',
            render: (value) => <div style={{ fontWeight: 'bold' }}>{value}</div>,
          },
          ...data.map((item, index) => {
            return {
              title: (
                <div key={index} className="flex justify-center">
                  <Tooltip title={item.app_name}>
                    <Image src={item.detail.app_icon} alt="" width={30} height={30} />
                  </Tooltip>
                </div>
              ),
              dataIndex: item.app_id,
              render: (value) => <div className="flex justify-center">{value}</div>,
            };
          }),
        ]
      : [];
  }, [data]);

  const params = [
    'Free',
    'Pricing Min',
    'Pricing Max',
    'Plans',
    'Rating',
    'Reviews',
    'Launch Date',
    'Highlights',
    'Patner Rating',
    'Partner Reviews',
  ];

  const getValue = (type, app) => {
    switch (type) {
      case 'Free':
        return app.free ? <CheckOutlined /> : <CloseOutlined />;
      case 'Pricing Min':
        return app.pricing_min;
      case 'Pricing Max':
        return app.pricing_max;
      case 'Plans':
        return app.number_pricing;
      case 'Reviews':
        return app.reviews;
      case 'Rating':
        return (
          <div>
            {app.rating}
            <StarFilled style={{ color: '#ffc225', marginLeft: '3px' }} />
          </div>
        );
      case 'Launch Date':
        return app.date ? app.date.slice(0, 10) : ' ';
      case 'Highlights':
        return (
          <div>
            <ul>
              {app.highlights && app.highlights.length > 0
                ? app.highlights.map((item, index) => <li key={index}>{item}</li>)
                : ' '}
            </ul>
          </div>
        );
      case 'Patner Rating':
        return (
          <div>
            {app.partner_rating}
            <StarFilled style={{ color: '#ffc225', marginLeft: '3px' }} />
          </div>
        );
      default:
        return app.partner_review;
    }
  };

  const dataSource = useMemo(() => {
    return params.map((item, index) => {
      const newObj = { param: item };
      data &&
        data.forEach((app) => {
          newObj[app.app_id] = getValue(item, app); // You can replace "3" with the desired value
        });
      return newObj;
    });
  }, [data]);

  useEffect(() => {
    asyncFetch(props.id);
  }, []);

  return (
    <Modal
      title="Overall Comparison"
      visible={true}
      footer={null}
      onOk={props.handleOk}
      onCancel={props.handleOk}
      width={'max-content'}
      className="overall"
    >
      <Table columns={columns} dataSource={dataSource} pagination={false} loading={loading} />
    </Modal>
  );
}
