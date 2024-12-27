'use client';

import React, { useEffect, useState } from 'react';
import { Table, Modal, message } from 'antd';
import { getDiffDay } from '@/utils/functions';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import dayjs from 'dayjs';
import CopyToClipboard from 'react-copy-to-clipboard';

export default function ModalDetailRetension(props) {
  const [loading, setLoading] = useState(false);
  const [dataDetail, setDataDetail] = useState(false);

  useEffect(() => {
    fetchDetailList(props.id, props.dateInstall, props.type);
  }, []);

  const fetchDetailList = async (id, date, type) => {
    setLoading(true);
    const result = await DetailAppApiService.getRetentionDetail(id, date, type);
    setLoading(false);
    if (result && result.code == 0) {
      setDataDetail(renderDetail(result.data));
    }
  };

  const renderDetail = (retentionList) => {
    if (retentionList) {
      return retentionList.map((item, index) => {
        const {
          shop,
          status,
          type,
          paid,
          install_at,
          uninstall_at,
          active_subscription_at,
          cancel_subscription_at,
          subscription_amount,
        } = item;
        const dataTable = {
          index,
          shop,
          status,
          type,
          install_at,
          uninstall_at,
          active_subscription_at,
          cancel_subscription_at,
          paid,
          diff:
            uninstall_at && install_at
              ? getDiffDay({
                  install_time: install_at,
                  uninstall_time: uninstall_at,
                })
              : ' ',
          subscription_amount,
          check: checkStatus(uninstall_at, install_at, status),
        };

        return dataTable;
      });
    }
  };

  const checkStatus = (uninstall_at, install_at, status) => {
    let uninstallAt = uninstall_at.substring(0, 10);
    if (uninstallAt < props.dateCheck && status === 'inactive' && props.dateInstall <= uninstallAt) {
      return 'uninstalled';
    } else {
      return 'normal';
    }
  };

  const sorterColumnDate = (a, b) => {
    if (a === '') {
      a = 0;
    }
    if (b === '') {
      b = 0;
    }
    return dayjs(a).unix() - dayjs(b).unix();
  };

  const columnsModal = [
    {
      title: '',
      width: 50,
      key: 'index',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'shop',
      width: 200,
      dataIndex: 'shop',
      key: 'shop',
      render: (dom) => {
        if (dom !== '') {
          const shop = dom.toString().replace('.myshopify.com', '...');
          return (
            <CopyToClipboard text={dom}>
              <span style={{ cursor: 'pointer' }} onClick={() => message.success('Copy shop success')}>
                {shop}
              </span>
            </CopyToClipboard>
          );
        }
      },
    },
    {
      title: 'status',
      dataIndex: 'status',
      width: 100,
      key: 'shop',
    },
    {
      title: 'type',
      dataIndex: 'type',
      width: 100,
      key: 'type',
    },
    {
      title: 'paid',
      width: 100,
      dataIndex: 'paid',
      key: 'paid',
      render: (dom) => {
        if (dom !== '') {
          return <span>${Math.ceil(dom * 100) / 100}</span>;
        }
      },
    },
    {
      title: 'Subscription',
      dataIndex: 'subscription_amount',
      width: 120,
      render: (dom) => {
        return <span>${dom}</span>;
      },
    },
    {
      title: 'Install at',
      dataIndex: 'install_at',
      key: 'install_at',
      width: 170,
      render: (dom) => {
        if (dom !== '') {
          return <span>{dayjs.utc(dom).format('YYYY-MM-DD H:mm:ss')}</span>;
        }
      },
    },
    {
      title: 'Uninstall at',
      dataIndex: 'uninstall_at',
      key: 'uninstall_at',
      width: 170,
      defaultSortOrder: 'ascend',
      sorter: (a, b) => sorterColumnDate(a.uninstall_at, b.uninstall_at),
      render: (dom) => {
        if (dom !== '') {
          return <span>{dayjs.utc(dom).format('YYYY-MM-DD H:mm:ss')}</span>;
        }
      },
    },
    {
      title: 'Diff',
      width: 100,
      dataIndex: 'diff',
      key: 'diff',
    },
    {
      title: 'Active Subs',
      dataIndex: 'active_subscription_at',
      key: 'active_subscription_at',
      render: (dom) => {
        if (dom !== '') {
          return <span>{dayjs.utc(dom).format('YYYY-MM-DD H:mm:ss')}</span>;
        }
      },
    },
    {
      title: 'Cancel Subs',
      dataIndex: 'cancel_subscription_at',
      key: 'cancel_subscription_at',
      render: (dom) => {
        if (dom !== '') {
          return <span>{dayjs.utc(dom).format('YYYY-MM-DD H:mm:ss')}</span>;
        }
      },
    },
  ];

  return (
    <Modal width={'75%'} title="Retention details" visible={props.visible} footer={null} onCancel={props.closeModal}>
      <div style={{ marginBottom: '1rem' }}>
        Installation time : <strong>{props.dateInstall}</strong> - Checking time: <strong>{props.dateCheck}</strong>{' '}
        <br /> Retention and merchant type is counted base on the last session of merchants.
      </div>
      <Table
        rowClassName={(record, index) => (record.check === 'uninstalled' ? 'uninstalled' : 'no_class')}
        scroll={{ x: '85%', y: 600 }}
        columns={columnsModal}
        pagination={false}
        dataSource={dataDetail}
        loading={loading}
      />
    </Modal>
  );
}
