'use client';

import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import { Empty, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import ItemCategory from './item-category/ItemCategory';
import './Category.scss';

export default function Category() {
  const [loading, setLoading] = useState(false);
  const [dataCategories, setDataCategories] = useState([]);

  const fetchCategories = async () => {
    setLoading(true);
    let result = await CategoriesApiService.getCategories();
    if (result && result.category) {
      let sortedData = result.category.map((cat) => {
        return {
          ...cat,
          child: cat.child
            .map((subCat) => {
              return {
                ...subCat,
                child: subCat.child.sort((a, b) => b.app_count - a.app_count),
              };
            })
            .sort((a, b) => b.app_count - a.app_count),
        };
      });
      setLoading(false);
      setDataCategories(sortedData);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderedList = dataCategories
    ? dataCategories.map((item, index) => {
        return (
          <div className="item-list" key={item._id || index}>
            <ItemCategory value={item} />
          </div>
        );
      })
    : '';

  return (
    <Spin spinning={loading}>
      <div className="categories container">
        <div className="header-categories">
          <h1 className="header-categories-title">Categories</h1>
        </div>
        {dataCategories && dataCategories.length > 0 ? <>{renderedList}</> : <Empty />}
      </div>
    </Spin>
  );
}
