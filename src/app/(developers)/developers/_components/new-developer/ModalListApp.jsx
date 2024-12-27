'use client';

import { Modal } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import TableApp from '@/components/landing-page/table-app/TableApp';
import Loading from '@/components/ui/loading/Loading';
import './ModalListApp.scss';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';

const ModalListApp = (props) => {
  const [loading, setLoading] = useState(false);
  const [listApps, setListApps] = useState();
  const page = useRef(1);
  const perPage = 20;

  useEffect(() => {
    fetchDevelopers(props.id, page.current, perPage);
  }, []);

  const fetchDevelopers = async (id, page, per_page) => {
    setLoading(true);
    const res = await DashboardDeveloperApiService.getDetailDeveloper(id, page, per_page);
    if (res) {
      setLoading(false);
      setListApps(res.data);
    }
  };

  const renderDataSource = (data) => {
    if (data) {
      return data.map((item) => {
        return {
          app: {
            img: item.detail.app_icon,
            name: item.detail.name || ' ',
            desc: item.detail.metatitle || ' ',
            slug: item.detail.app_id,
          },
          diffRank: item.detail.launched ? item.detail.launched.substring(0, 10) : ' ',
        };
      });
    }
    return [];
  };

  return (
    <Modal
      width={'40%'}
      title="Applications"
      className="modal"
      visible={true}
      footer={null}
      onOk={props.handleCancel}
      onCancel={props.handleCancel}
    >
      {loading ? (
        <Loading />
      ) : (
        <TableApp
          item={{
            title: 'Applications',
            data: renderDataSource(listApps && listApps.apps),
          }}
          isDashboard
        />
      )}
    </Modal>
  );
};

export default ModalListApp;
