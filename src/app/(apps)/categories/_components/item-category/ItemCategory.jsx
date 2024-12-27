'use client';

import Link from 'next/link';
import React from 'react';
import './ItemCategory.scss';

export default function ItemCategory({ value }) {
  const itemsChild = value && value.child ? value.child : '';

  const renderedListAll = (categories, dataCategories = [], margin = 0, size = 0, fontWeight = 0) => {
    let data = dataCategories;
    margin = margin + 30;
    size = size + 16;
    fontWeight = fontWeight + 500;
    categories.forEach((item, index) => {
      data.push(
        <div style={{ marginLeft: margin, fontSize: size }} className="list-item-categories" key={item.category_id || index}>
          <div className="item-categories-detail">
            <div className="item-name">
              <Link prefetch={false} style={{ fontWeight: fontWeight }} href={'/category/' + item.category_id}>
                {item.category_name}
              </Link>
            </div>
            <div className="amount-app">{item.total_apps} apps</div>
          </div>
        </div>,
      );
      if (item.child && item.child.length) {
        renderedListAll(item.child, data, margin + 15, size - 18, fontWeight - 600);
      }
    });
    return data;
  };

  return (
    <div className="item-categories">
      <div className="title-categories">
        <div className="item-categories-detail">
          <div className="item-name">
            <Link prefetch={false} style={{ fontWeight: 600 }} href={'/category/' + value.category_id}>
              {value.category_name}
            </Link>
          </div>
          <div className="amount-app">{value.total_apps} apps</div>
        </div>
      </div>
      {renderedListAll(itemsChild, [])}
    </div>
  );
}
