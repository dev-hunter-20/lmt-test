'use client';

import React from 'react';
import { Typography, Breadcrumb as AntdBreadcrumb } from 'antd';
import './Breadcrumb.scss';
import classNames from 'classnames';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

const Breadcrumb = ({ data = [], title }) => {
  const router = useRouter();

  const handleClickItem = (dataMenu) => {
    if (dataMenu.link) router.push(dataMenu.link);
    dataMenu.onClick?.();
  };

  return (
    <div className="Breadcrumb">
      <AntdBreadcrumb>
        {data.map((item, index) => (
          <AntdBreadcrumb.Item
            key={index}
            className={classNames({ 'cursor-pointer': item.link })}
            onClick={() => handleClickItem(item)}
          >
            {item.title}
          </AntdBreadcrumb.Item>
        ))}
      </AntdBreadcrumb>

      {title && (
        <Title level={4} className="Breadcrumb-title">
          {title}
        </Title>
      )}
    </div>
  );
};

export default Breadcrumb;
