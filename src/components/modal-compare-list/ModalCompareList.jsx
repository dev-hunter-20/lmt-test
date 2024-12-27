'use client';

import { Button, List, message, Modal } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { DeleteFilled, PlusCircleFilled } from '@ant-design/icons';
import './ModalCompareList.scss';
import { openNotificationWarning } from '@/utils/functions';

const CompareSearch = dynamic(() => import('./compare-search/CompareSearch'), { ssr: false });

export default function ModalCompareList({ visible, onOk, onCancel, appId, infoApp, dataSearch, dataDeveloper }) {
  const [selectedApps, setSelectedApps] = useState([]);
  const [isCompareModalVisible, setIsCompareModalVisible] = useState(false);
  const [recommendedApps, setRecommendedApps] = useState([]);

  const handleAddApp = (app) => {
    const appExists = selectedApps.some((selectedApp) => selectedApp.app_id === app.app_id);

    if (appExists) {
      openNotificationWarning();
      return;
    }
    if (selectedApps.length < 4) {
      setSelectedApps((prevApps) => {
        const updatedApps = [...prevApps, app];
        return updatedApps.sort((a, b) => a.app_id.localeCompare(b.app_id));
      });
    }
  };

  const handleRemoveApp = (appId) => {
    setSelectedApps((prevApps) => prevApps.filter((app) => app.app_id !== appId));
  };

  const dataSearchCategorySlug = dataSearch ? dataSearch.map((data) => data.categories) : [];
  const appDetails = [];

  dataSearchCategorySlug.forEach((categoryArray) => {
    categoryArray?.forEach((category) => {
      if (category.top_3_apps && category.top_3_apps.length > 0) {
        category.top_3_apps.forEach((app) => {
          appDetails.push({
            app_id: app.app_id,
            app_icon: app.detail.app_icon,
            name: app.detail.name,
          });
        });
      }
    });
  });

  const uniqueAppDetails = Array.from(new Map(appDetails.map((item) => [item.app_id, item])).values());

  const appDetailsFromInfoApp = [];
  if (infoApp?.app_compare) {
    infoApp.app_compare.forEach((appCompareItem) => {
      if (appCompareItem.top_3_apps && appCompareItem.top_3_apps.length > 0) {
        appCompareItem.top_3_apps.forEach((app) => {
          appDetailsFromInfoApp.push({
            app_id: app.app_id,
            app_icon: app.detail.app_icon,
            name: app.detail?.name || '',
          });
        });
      }
    });
  }

  const uniqueAppDetailsFromInfoApp = Array.from(
    new Map(appDetailsFromInfoApp.map((item) => [item.app_id, item])).values(),
  );

  const dataDeveloperApps = dataDeveloper ? dataDeveloper.map((data) => data.categories) : [];
  const developerAppDetails = [];

  dataDeveloperApps.forEach((categoryArray) => {
    categoryArray.forEach((category) => {
      if (category.top_3_apps && category.top_3_apps.length > 0) {
        category.top_3_apps.forEach((app) => {
          developerAppDetails.push({
            app_id: app.app_id,
            app_icon: app.detail.app_icon,
            name: app.detail.name,
          });
        });
      }
    });
  });

  const uniqueDeveloperAppDetails = Array.from(
    new Map(developerAppDetails.map((item) => [item.app_id, item])).values(),
  );

  const appDetailsLoginIsGA = [];
  if (infoApp && Array.isArray(infoApp.categories)) {
    infoApp.categories.forEach((categoryArray) => {
      if (categoryArray.top_3_apps && categoryArray.top_3_apps.length > 0) {
        categoryArray.top_3_apps.forEach((app) => {
          appDetailsLoginIsGA.push({
            app_id: app.app_id,
            app_icon: app.detail?.app_icon || '',
            name: app.detail?.name || '',
          });
        });
      }
    });
  }
  const uniqueAppDetailsLoginIsGA = Array.from(
    new Map(appDetailsLoginIsGA.map((item) => [item.app_id, item])).values(),
  );

  const handleShowCompareModal = () => {
    setIsCompareModalVisible(true);
    const getRecommendedApps = () => {
      if (infoApp?.app_compare?.length) return uniqueAppDetailsFromInfoApp;
      if (dataSearchCategorySlug?.length) return uniqueAppDetails;
      if (dataDeveloperApps?.length) return uniqueDeveloperAppDetails;
      if (infoApp?.categories?.length) return uniqueAppDetailsLoginIsGA;
      return [];
    };
    setRecommendedApps(getRecommendedApps());
  };

  const handleCloseCompareModal = () => {
    setIsCompareModalVisible(false);
  };

  const handleRemoveAllApps = () => {
    setSelectedApps([]);
  };

  const handleOk = () => {
    if (selectedApps.length === 0) {
      message.warning('Please add at least one app to compare.');
      return;
    }

    const compareAppIds = selectedApps.map((app) => app.app_id).join('-lmtvs-');
    const appNames = [appId, ...compareAppIds.split('-lmtvs-')];
    appNames.sort((a, b) => a.localeCompare(b));
    const sortedCompareApps = appNames.slice(1).join('-lmtvs-');
    const compareUrl = `/app/${appNames[0]}/compare-app/vs/${sortedCompareApps}`;

    window.open(compareUrl, '_blank');
  };

  const buttonPosition = selectedApps.length < 4 ? selectedApps.length : -1;

  return (
    <Modal
      title="App Compare "
      open={visible}
      onCancel={onCancel}
      footer={[
        <div className="btn-footer" key="footer-buttons">
          {selectedApps.length > 0 && (
            <Button key="removeAll" onClick={handleRemoveAllApps} type="link" danger>
              Remove all
            </Button>
          )}
          <Button key="seeComparison" onClick={handleOk} type="primary">
            See comparison
          </Button>
        </div>,
      ]}
    >
      <div className="content-compare">
        <List
          itemLayout="horizontal"
          dataSource={[
            ...selectedApps.slice(0, buttonPosition).sort((a, b) => a.app_id.localeCompare(b.app_id)),
            ...(buttonPosition >= 0 ? [{ id: 'addButton' }] : []),
            ...selectedApps.slice(buttonPosition).sort((a, b) => a.app_id.localeCompare(b.app_id)),
          ]}
          renderItem={(item, index) => {
            if (item.id === 'addButton') {
              return (
                <List.Item>
                  <Button onClick={handleShowCompareModal} type="btn" className="plus-app">
                    <PlusCircleFilled />
                  </Button>
                </List.Item>
              );
            }
            return (
              <List.Item
                actions={[
                  <Button
                    key={`remove-${item.app_id}`}
                    type="link"
                    danger
                    onClick={() => handleRemoveApp(item.app_id)}
                    className="delete-app"
                  >
                    <DeleteFilled />
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  avatar={<Image src={item.app_icon} alt={item.name} width={35} height={35} />}
                  title={item.name}
                />
              </List.Item>
            );
          }}
        />

        {isCompareModalVisible && (
          <CompareSearch
            disableModal={handleCloseCompareModal}
            addAppToCompare={handleAddApp}
            competitor={selectedApps}
            recommendedApps={recommendedApps}
            appId={appId}
          />
        )}
      </div>
    </Modal>
  );
}
