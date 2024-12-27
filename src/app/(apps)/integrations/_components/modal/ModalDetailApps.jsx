'use client';

import DashboardApiService from '@/api-services/api/DashboardApiService';
import TableApp from '@/components/landing-page/table-app/TableApp';
import { Modal, Pagination } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

export default function ModalDetailApps({ name, handleCancel }) {
  const [loading, setLoading] = useState(false);
  const [listApps, setListApps] = useState([]);
  const page = useRef(1);
  const perPage = 20;
  const [total, setTotal] = useState();

  const getListApps = async (id, current_page, per_page, sortBy) => {
    setLoading(true);
    const res = await DashboardApiService.getIntegrationsApp(id, current_page, per_page, sortBy);
    if (res) {
      setLoading(false);
      setListApps(res.result);
      setTotal(res.total_app);
    }
  };

  useEffect(() => {
    getListApps(name, page.current, perPage, 'newest');
  }, []);

  const renderDataSource = (data) => {
    return data
      ? data.map((item) => {
          const app = item.detail;
          return {
            app: {
              img: app.app_icon,
              name: app.name || null,
              desc: app.metatitle || null,
              slug: app.app_id,
            },
            diffRank: app.review_count.toString(),
          };
        })
      : [];
  };

  const onChangePage = (page) => {
    getListApps(name, page, perPage, 'newest');
  };

  return (
    <Modal width={'50%'} title={name} visible={true} footer={null} onOk={handleCancel} onCancel={handleCancel}>
      <div className="modal-churn-value">
        <TableApp
          item={{
            title: 'Applications',
            data: renderDataSource(listApps),
          }}
          isReview
          loading={loading}
        />
      </div>
      {total > 0 ? (
        <div style={{ marginTop: '20px' }} className="flex justify-center">
          <Pagination
            pageSize={perPage}
            current={page.current}
            onChange={(pageNumber) => {
              page.current = pageNumber;
              onChangePage(pageNumber);
            }}
            total={total ? total : ''}
            showSizeChanger={false}
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} apps`}
          />
        </div>
      ) : (
        ''
      )}
    </Modal>
  );
}
