'use client';

import { Button, Modal, Spin, message } from 'antd';
import Image from 'next/image';
import React, { useRef, useMemo, useState, useCallback } from 'react';
import { LoadingOutlined, FileSearchOutlined } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import './ModalCompetitor.scss';
import Input from '../ui/input/Input';
import { debounce } from 'lodash';

export default function ModalCompetitor(props) {
  const page = useRef(1);
  const [listResult, setListResult] = useState([]);
  const [itemActive, setItemActive] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  const dataRecommended = props.infoApp.data?.categories || [];
  const dataCompare = props.competitor.map((compare) => compare.appId) || [];

  const recommendedApps = dataRecommended
    .flatMap((category) =>
      category.top_3_apps.map((app) => ({
        app_id: app.detail.app_id,
        app_icon: app.detail.app_icon,
        name: app.detail.name,
      })),
    )
    .filter((app, index, self) => index === self.findIndex((t) => t.app_id === app.app_id));

  const filteredDataRecommended = recommendedApps.filter((item) => !dataCompare.includes(item.app_id));

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const saveCompetitor = async () => {
    const appId = props.appId;
    if (appId) {
      if (itemActive) {
        const result = await DetailAppApiService.addCompetitor(appId, itemActive.app_id);
        if (result.code === 0) {
          props.dataTabNew(itemActive);
          props.disableModal();
          setItemActive(null);
          message.success('Add competitor success');
        } else {
          message.error('Add competitor error');
        }
      } else {
        message.warn('Please select a app');
        return;
      }
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (value.trim() === '') {
          setSearching(false);
          setListResult([]);
          return;
        }
        setSearching(true);
        setIsLoading(true);
        try {
          if (value) {
            const result = await DetailAppApiService.searchData(value, page.current, 100);
            if (result && result.code === 0) {
              if (result.data && result.data.apps) {
                const data = [];
                if (result.data.apps) {
                  result.data.apps.map((item) => {
                    const index = props.competitor.findIndex((i) => i.appId === item.app_id);
                    if (index === -1 && item.detail && item.detail.app_icon !== null) {
                      data.push(item);
                    }
                  });
                  setListResult(data);
                }
              }
            }
          } else {
            setListResult([]);
          }
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      }, 300),
    [],
  );

  const onSearch = useCallback(
    (value) => {
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const selectItem = (item) => () => {
    setItemActive(item);
  };

  return (
    <Modal width={420} title="Add Competitor" visible={true} footer={null} onOk={handleOk} onCancel={handleCancel}>
      <div className="popup-add-competitor">
        <div className="input-competitor">
          <div className="search-data">
            <Input placeholder="Application name" onSearch={onSearch} autoFocus />
          </div>
          {searching ? (
            <>
              {!listResult || listResult.length === 0 ? (
                <Spin
                  style={{ width: '100%' }}
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                  spinning={isLoading}
                >
                  <div className="flex justify-center">
                    <FileSearchOutlined className="search-icon" />
                  </div>
                </Spin>
              ) : (
                <>
                  <div className="result-search">
                    {listResult &&
                      listResult.map((item, index) => (
                        <div
                          className={`item-name ${itemActive?.app_id === item.detail.app_id ? 'item-active' : ''}`}
                          key={index}
                          onClick={selectItem(item.detail)}
                        >
                          {item.detail && item.detail.app_icon && (
                            <Image
                              src={item.detail.app_icon}
                              alt={item.detail.name || 'App icon'}
                              width={30}
                              height={30}
                              style={{ marginRight: '8px', borderRadius: '4px' }}
                            />
                          )}
                          {item.detail ? item.detail.name : ''}
                        </div>
                      ))}
                  </div>
                  <div className="item-active"></div>
                  <div className="save-competitor">
                    <Button
                      htmlType="submit"
                      className="button-add"
                      type="primary"
                      onClick={saveCompetitor}
                      style={{ width: 320 }}
                    >
                      Add
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : filteredDataRecommended.length > 0 ? (
            <>
              <div className="recommend">Recommended</div>
              <div className="result-search-recommend">
                {filteredDataRecommended.map((item, index) => (
                  <div
                    className={`item-name ${itemActive?.app_id === item.app_id ? 'item-active' : ''}`}
                    key={index}
                    onClick={selectItem(item)}
                  >
                    {item.app_icon && (
                      <Image
                        src={item.app_icon}
                        alt={item.name || 'App icon'}
                        width={30}
                        height={30}
                        style={{ marginRight: '8px', borderRadius: '4px' }}
                      />
                    )}
                    {item.name || ''}
                  </div>
                ))}
              </div>
              <div className="item-active"></div>
              <div className="save-competitor">
                <Button
                  htmlType="submit"
                  className="button-add"
                  type="primary"
                  onClick={saveCompetitor}
                  style={{ width: 320 }}
                >
                  Add
                </Button>
              </div>
            </>
          ) : (
            <Spin
              style={{ width: '100%' }}
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
              spinning={isLoading}
            >
              <div className="flex justify-center">
                <FileSearchOutlined className="search-icon" />
              </div>
            </Spin>
          )}
        </div>
      </div>
    </Modal>
  );
}
