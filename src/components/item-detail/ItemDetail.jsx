'use client';

import React, { useState } from 'react';
import './ItemDetail.scss';
import Image from 'next/image';
import Link from 'next/link';
import { Badge, Button, Row, Tooltip, Typography } from 'antd';
import { SketchOutlined, StarFilled, SwapOutlined } from '@ant-design/icons';
import { renderBadge } from '@/utils/functions';
import ModalCompareList from '../modal-compare-list/ModalCompareList';
import { usePathname } from 'next/navigation';

export default function ItemDetail(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const appDetail = props.value.detail || props.value;
  const idApp = props.value._id || props.value.app_id;
  const pathname = usePathname();
  const dataSearch = props.data?.apps;
  const dataDeveloper = props.dataDeveloper;

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleCompareClick = () => {
    showModal();
  };

  const appNames = [pathname.slice(5), appDetail.app_id];
  appNames.sort((a, b) => a.localeCompare(b));

  const compareUrl = `/app/${appNames[0]}/compare-app/vs/${appNames[1]}`;

  const renderContent = () => {
    return (
      <>
        {props.value ? (
          <div className="info-item">
            <div className="icon-compare">
              <Tooltip title={'Compare'}>
                {pathname.includes('/app/') ? (
                  <Link href={compareUrl}>
                    <SwapOutlined />
                  </Link>
                ) : (
                  <Button type="link" onClick={handleCompareClick}>
                    <SwapOutlined />
                  </Button>
                )}
              </Tooltip>
            </div>
            <div className={appDetail.built_for_shopify ? 'item-develop mt-10' : 'item-develop'}>
              <div className="image-item">
                {appDetail.app_icon ? (
                  <Image src={appDetail.app_icon} width={90} height={90} alt="App Icon" />
                ) : (
                  <Image src="/image/no-image.webp" width={90} height={90} alt="No icon app" />
                )}
              </div>
              <div className="content">
                <div className="text-item">
                  <Link prefetch={false} href={'/app/' + appDetail.app_id}>
                    {appDetail ? appDetail.name : ''}
                  </Link>
                </div>
                <Row className="review">
                  <StarFilled />{' '}
                  <span>
                    {appDetail
                      ? `${appDetail.star} (${
                          appDetail.review_count !== undefined ? appDetail.review_count : appDetail.review
                        })`
                      : ''}
                  </span>
                  <Typography.Paragraph
                    className={appDetail.pricing ? 'price' : 'price-empty'}
                    ellipsis={{
                      tooltip: appDetail.pricing,
                      rows: 1,
                    }}
                  >
                    {appDetail.pricing || ''}
                  </Typography.Paragraph>
                </Row>
                <Typography.Paragraph
                  className="tagline"
                  ellipsis={{
                    tooltip: appDetail.tagline || '',
                    rows: 1,
                  }}
                >
                  {appDetail ? appDetail.tagline : ''}
                </Typography.Paragraph>
              </div>
            </div>
            <div>{renderBadge(appDetail.highlights)}</div>
          </div>
        ) : (
          ''
        )}
      </>
    );
  };

  return (
    <div className="app-item_compare">
      {appDetail.built_for_shopify ? (
        <Badge.Ribbon
          className="built-shopify"
          text={
            <div className="built-shopify-label">
              <SketchOutlined />
              Built for shopify
            </div>
          }
        >
          {renderContent()}
        </Badge.Ribbon>
      ) : (
        renderContent()
      )}

      <ModalCompareList
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        appId={idApp}
        dataSearch={dataSearch}
        dataDeveloper={dataDeveloper}
      />
    </div>
  );
}
