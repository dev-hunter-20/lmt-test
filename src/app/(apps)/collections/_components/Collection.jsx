'use client';

import { Empty, Spin } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import './Collection.scss';
import CollectionApiService from '@/api-services/api/CollectionApiService';

export default function Collection() {
  const [dataCollections, setDataCollections] = useState();
  const [dataSearch, setDataSearch] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsLoading(true);
    let result = await CollectionApiService.getCollections();
    if (result && result.collection) {
      setDataCollections(result.collection.sort((a, b) => b.app_count - a.app_count));
    }
    setIsLoading(false);
  };

  const renderedList = useMemo(() => {
    if (dataSearch) {
      return dataSearch;
    }
    if (dataCollections && dataCollections.length > 0) {
      return dataCollections;
    }
    return [];
  }, [dataCollections, dataSearch]);


  const onSearch = async (value) => {
    if (value) {
      const listSearch = dataCollections.filter((item) => item.text.toLowerCase().includes(value.toLowerCase()));
      if (listSearch && listSearch.length > 0) {
        setDataSearch(listSearch);
        return;
      }
      setDataSearch([]);
      return;
    }
    setDataSearch(null);
  };

  return (
    <Spin spinning={isLoading}>
      <div className="collections container">
        <div className="header-collections">
          <h1 className="header-collections-title">Collections</h1>
        </div>
        {renderedList && renderedList.length > 0 ? (
          <div className="item-list">
            <div className="item-collections">
              {renderedList.map((item, index) => (
                <div key={index} className="item-list-collections">
                  <a href={`/collection/${item.collection_id}`}>{item.collection_name}</a>
                  <div className="amount-app">{item.total_apps} apps</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <Empty />
        )}
      </div>
    </Spin>
  );
}
