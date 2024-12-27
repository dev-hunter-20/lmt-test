'use client';

import React, { useState } from 'react';
import {
  StarFilled,
  DeleteOutlined,
  PlusOutlined,
  BarChartOutlined,
  DatabaseOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { Button, Skeleton, message, Tooltip } from 'antd';
import Image from 'next/image';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import Link from 'next/link';

export default function InfoApp(props) {
  const [loadingTrackingApp, setloadingTrackingApp] = useState(false);
  const [loadingConnectPartner, setloadingConnectPartner] = useState(false);
  const loading = props.loadingAppInfo;
  const isBuilt4Shopify = props.infoApp?.isBuilt4Shopify;
  const infoApp = props.infoApp?.data;
  const isOwner = props.infoApp?.isOwner;
  const gaConnected = props.infoApp?.gaConnected;
  const partnerConnected = props.infoApp?.partnerConnected;
  const canAddGId = props.infoApp?.canAddGId;
  const getLink =
    'https://apps.shopify.com/' +
    props.id +
    `?utm_source=letsmetrix.com&utm_medium=app_detail&utm_content=${infoApp ? infoApp.detail.name : ''}`;
  const getTitle = 'apps.shopify.com/' + props.id;

  const syncGoogleAlynatic = async () => {
    const result = await DetailAppApiService.gaLogin(props.id);
    if (result && result.code == 0) {
      window.location.href = result.authorization_url;
    }
  };

  const handleConnectGA = () => {
    syncGoogleAlynatic();
  };

  const handleTrackingApp = async () => {
    setloadingTrackingApp(true);
    await props.trackingApp();
    setloadingTrackingApp(false);
  };

  const handleConnectPartner = async (partnerConnected) => {
    if (partnerConnected) {
      setloadingConnectPartner(true);
      const result = await DetailAppApiService.disconnectPartner(props.id);
      if (result && result.code == 0) {
        props.setInfoApp((prev) => {
          return { ...prev, partnerConnected: false };
        });
        message.success('Disconnect partner app successfully!');
        setloadingConnectPartner(false);
      } else {
        message.error('Disconnect failed!');
      }
      return;
    }
    if (canAddGId) {
      props.editPartnerAppId();
      return;
    }
    setloadingConnectPartner(true);
    const result = await DetailAppApiService.connectPartner(props.id);
    if (result && result.code == 0) {
      setloadingConnectPartner(false);
      props.fetchDataSyncPartner();
    } else {
      message.error('Connect failed!');
    }
  };

  return (
    <>
      <div className="detail-app">
        <div className="detail-app-info">
          <div className="image">
            {loading ? (
              <Skeleton.Image className="skeleton-image" active={true} />
            ) : (
              <>
                {infoApp && infoApp.detail.app_icon ? (
                  <Image src={infoApp.detail.app_icon} width={90} height={90} alt="App Icon" />
                ) : (
                  <Image src="/image/no-image.webp" width={90} height={90} alt="No icon app" />
                )}
              </>
            )}
          </div>
          <div className="title-app">
            {loading ? (
              <Skeleton paragraph={{ rows: 2 }} active />
            ) : (
              <>
                <h1 className="name">{infoApp && infoApp.detail.name}</h1>
                {isBuilt4Shopify && (
                  <div className="built4-shopify">
                    <Tooltip title="Built for shopify">
                      <Image src="/image/diamond.svg" alt="diamond" width={20} height={20} className="diamond-icon" />
                      <strong>{infoApp.detail.rank_bfs ? <>{infoApp.detail.rank_bfs}</> : null}</strong>
                    </Tooltip>
                  </div>
                )}
                <div className="tagline" style={{ marginTop: isBuilt4Shopify ? '5px' : '0' }}>
                  {infoApp && infoApp.detail.tagline}
                </div>
                <div className="by">
                  <span>by </span>
                  <Link
                    href={
                      infoApp && infoApp.detail.partner
                        ? infoApp && '/developer/' + infoApp.detail.partner.id.replace('/partners/', '')
                        : '#'
                    }
                    target="_blank"
                    prefetch={false}
                  >
                    {infoApp && infoApp.detail.partner ? infoApp && infoApp.detail.partner.name : ''}
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="view-on-shopify">
        <span>
          View on Shopify:{' '}
          <Link prefetch={false} href={getLink} target="blank" rel="nofollow">
            {getTitle}
          </Link>
        </span>
      </div>
      <div className="rating">
        <span>Rating </span>
        <span className="star">
          <StarFilled /> {infoApp && infoApp.detail.star}
        </span>{' '}
        |{' '}
        <Link prefetch={false} href={'/app/' + props.id + '/reviews'}>
          {' '}
          {infoApp && infoApp.detail.review_count} reviews{' '}
        </Link>
      </div>
      <div className={'content-pricing'}>{infoApp && infoApp.detail.pricing}</div>
      <div className="sync-google">
        {!loading && (
          <>
            <Button
              type="primary"
              size={'large'}
              onClick={() => handleTrackingApp()}
              className="button-edit-app mt-10"
              loading={loadingTrackingApp}
              icon={isOwner ? <DeleteOutlined /> : <PlusOutlined />}
              disabled={!isOwner && (infoApp?.unlisted || infoApp?.delete)}
            >
              {isOwner ? 'Remove app' : 'Add your app'}
            </Button>

            {isOwner && (
              <>
                {!gaConnected && (
                  <Tooltip
                    color="#fff"
                    title={
                      <span style={{ color: 'black' }}>
                        How to
                        <Link
                          target="_blank"
                          rel="noopener noreferrer"
                          href="https://docs.letsmetrix.com/get-started/sync-ga-with-letsmetrix"
                          prefetch={false}
                        >
                          Sync Google analytics <QuestionCircleOutlined />
                        </Link>
                      </span>
                    }
                  >
                    <Button
                      type="primary mt-10"
                      size={'large'}
                      onClick={() => handleConnectGA()}
                      className="button-edit-app"
                      icon={<BarChartOutlined />}
                    >
                      Sync GA data
                    </Button>
                  </Tooltip>
                )}

                {!partnerConnected && (
                  <Button
                    className="button-add-gid mt-10"
                    size={'large'}
                    type="primary"
                    onClick={() => handleConnectPartner(partnerConnected)}
                    icon={<DatabaseOutlined />}
                    loading={loadingConnectPartner}
                  >
                    Sync Partner Data
                  </Button>
                )}
              </>
            )}
            <Button
              type="primary mt-10"
              size={'large'}
              onClick={props.editListingApp}
              className="button-edit-app"
              icon={<EditOutlined />}
            >
              Optimize Listing
            </Button>
          </>
        )}
      </div>
    </>
  );
}
