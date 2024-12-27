'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Modal, Space, Table } from 'antd';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import TableRowExpand from './table/TableRowExpand';

export default function ModalReinstall(props) {
  const [dataTable, setDataTable] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDetailList(props.appId, props.period);
  }, [props]);

  const handleOk = () => {
    props.disableModal();
  };

  const fetchDetailList = async (id, period) => {
    setLoading(true);
    const result = await DetailAppApiService.getDetailNumberReinstallShopByTime(id, period);
    setLoading(false);
    if (result && result.code === 0) {
      setDataTable(createDataTable(result.data));
    }
  };

  const createDataTable = (object) => {
    const data = [];
    object &&
      object.map((item, index) => {
        const shopInfo = item;
        data.push({
          index: index,
          id: item.id,
          avatarUrl: shopInfo.shop.avatarUrl,
          myshopifyDomain: shopInfo.shop.myshopifyDomain,
          name: shopInfo.shop.name,
          active: shopInfo.active,
          reinstall_count: shopInfo.reinstall_count ? shopInfo.reinstall_count : '',
        });
      });
    return data;
  };

  const getTitle = useMemo(() => {
    switch (props.period) {
      case 2:
        return 'Reinstall 1 - 14 days from reinstall';
      case 3:
        return 'Reinstall 15 - 90 days from reinstall';
      case 4:
        return 'Reinstall 91+ days from reinstall';
      default:
        return 'Same day as reinstall';
    }
  }, [props.period]);

  const columns = [
    {
      title: 'Shopify Domain',
      dataIndex: 'myshopifyDomain',
      render: (item) => (
        <div className="myshopify-domain">
          <a target="_blank" href={'https://' + item}>
            {item}
          </a>
        </div>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Active',
      dataIndex: 'active',
      render: (active) => (
        <Space size="middle">
          {active ? (
            <CheckCircleOutlined style={{ color: '#52c41a' }} />
          ) : (
            <CloseCircleOutlined style={{ color: '#f5222d' }} />
          )}
        </Space>
      ),
    },
    {
      title: 'Total number reinstallations of the shop',
      dataIndex: 'reinstall_count',
    },
  ].filter((item) => !item.hidden);

  return (
    <>
      <Modal width={'100%'} title={getTitle} visible={true} footer={null} onOk={handleOk} onCancel={handleOk}>
        <div className="modal-churn-value">
          <Table
            columns={columns}
            dataSource={dataTable}
            pagination={false}
            scroll={{ y: 500, x: 992 }}
            loading={loading}
            expandable={{
              expandedRowRender: (record) => <TableRowExpand record={record} appId={props.appId} fromDate={props.fromDate} toDate={props.toDate}/>,
            }}
            rowKey={(record) => record.myshopifyDomain ?? 0}
          />
        </div>
      </Modal>
    </>
  );
}
