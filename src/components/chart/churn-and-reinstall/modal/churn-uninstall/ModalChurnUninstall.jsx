'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { getDiffDay } from '@/utils/functions';
import dayjs from 'dayjs';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc)

export default function ModalChurnUninstall(props) {
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
    const result = await DetailAppApiService.getUninstallDetail(id, period);
    setLoading(false);
    if (result && result.code == 0) {
      setDataTable(createDataTable(result.data));
    }
  };

  const convertDate = (date) => {
    const format = 'YYYY-MM-DD HH:mm:ss';
    return dayjs.utc(date, 'ddd, DD MMM YYYY HH:mm:ss z').format(format);
  };

  const createDataTable = (object) => {
    const data = [];
    object &&
      object.map((item, index) => {
        const shopInfo = item.uninstalled_shop;
        data.push({
          index: index,
          id: item.id,
          avatarUrl: shopInfo.shop.avatarUrl,
          install_time: !shopInfo.install_time ? 'before 91 days' : convertDate(shopInfo.install_time),
          myshopifyDomain: shopInfo.shop.myshopifyDomain,
          name: shopInfo.shop.name,
          uninstall_time: convertDate(shopInfo.uninstall_time),
          diffDay: shopInfo && getDiffDay(shopInfo),
          reason: shopInfo.reason ? shopInfo.reason : '',
        });
      });
    data.sort(function (a, b) {
      return a.uninstall_time < b.uninstall_time ? 1 : a.uninstall_time > b.uninstall_time ? -1 : 0;
    });
    return data;
  };

  const getTitle = useMemo(() => {
    switch (props.period) {
      case 2:
        return 'Uninstall 1 - 14 days from install';
      case 3:
        return 'Uninstall 15 - 90 days from install';
      case 4:
        return 'Uninstall 91+ days from install';
      default:
        return 'Same day as install';
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
      title: 'Diff',
      dataIndex: 'diffDay',
      hidden: props.period === 4,
    },
    {
      title: 'Install time',
      dataIndex: 'install_time',
    },
    {
      title: 'Uninstall time',
      dataIndex: 'uninstall_time',
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
    },
  ].filter((item) => !item.hidden);

  return (
    <Modal width={'100%'} title={getTitle} visible={true} footer={null} onOk={handleOk} onCancel={handleOk}>
      <div className="modal-churn-value">
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={false}
          scroll={{ y: 500, x: 992 }}
          loading={loading}
        />
      </div>
    </Modal>
  );
}
