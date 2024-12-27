'use client';

import { PlusOutlined, StarFilled, SwapOutlined } from '@ant-design/icons';
import { Button, Skeleton, Tooltip } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import './InfoApp.scss';
import ModalCompareList from '@/components/modal-compare-list/ModalCompareList';
import { usePathname, useRouter } from 'next/navigation';
import SkeletonImage from 'antd/es/skeleton/Image';
import { LayoutPaths, Paths } from '@/router';

export default function InfoApp(props) {
  const { loadingAppInfo, id } = props;
  const loading = loadingAppInfo;
  const isBuilt4Shopify = props.infoApp?.isBuilt4Shopify;
  const infoApp = props.infoApp?.data;
  const getLink =
    'https://apps.shopify.com/' +
    props.id +
    `?utm_source=letsmetrix.com&utm_medium=app_detail&utm_content=${infoApp ? infoApp.detail.name : ''}`;
  const [isSticky, setIsSticky] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleScroll = () => {
    const infoAppElement = document.querySelector('.info-app');
    if (infoAppElement) {
      const offsetTop = infoAppElement.getBoundingClientRect().top;
      if (offsetTop <= 75) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`detail-app-container ${isSticky ? 'sticky' : ''}`}>
      {loading || !infoApp ? (
        <div className="no-content">
          <SkeletonImage active={true} />
          <Skeleton paragraph={{ rows: 2 }} active={true} />
        </div>
      ) : (
        <div className="detail-app-info">
          <div className="image">
            {infoApp && infoApp.detail.app_icon ? (
              <Image
                className={`detail-app-image ${isSticky ? 'sticky' : ''}`}
                src={infoApp.detail.app_icon}
                width={100}
                height={100}
                alt="App Icon"
                style={{ objectFit: 'contain' }}
              />
            ) : (
              <Image
                className={`detail-app-image ${isSticky ? 'sticky' : ''}`}
                src="/image/no-image.webp"
                width={100}
                height={100}
                alt="No icon app"
                style={{ objectFit: 'contain' }}
              />
            )}
          </div>
          <div className={`content`}>
            <div className="title-app">
              <div className="name-app">
                {pathname.includes(`/app/${id}/pricing`) || pathname.includes(`/app/${id}/reviews`) ? (
                  <span>{infoApp && infoApp.detail.name}</span>
                ) : (
                  <h1 className="name">{infoApp && infoApp.detail.name}</h1>
                )}
                <Link prefix="false" href={getLink} target="__blank" rel="nofollow noopener noreferrer">
                  <Image src={'/image/share.webp'} alt="open-link" width={25} height={25} />
                </Link>
              </div>
              <div className={`review-isbuild ${isSticky ? 'sticky' : ''}`}>
                {infoApp && infoApp.detail.built_for_shopify && (
                  <div className="built4-shopify">
                    <Tooltip title="Built for shopify">
                      <Image src="/image/diamond.svg" alt="diamond" width={20} height={20} className="diamond-icon" />
                      <strong>{infoApp.detail.rank_bfs ? <>{infoApp.detail.rank_bfs}</> : null}</strong>
                    </Tooltip>
                  </div>
                )}
                <div className="rating">
                  <span className="star">
                    <StarFilled /> {infoApp && infoApp.detail.star}
                  </span>{' '}
                  |{' '}
                  <Link prefetch={false} href={`/app/${id}/reviews`}>
                    {infoApp && infoApp.detail.review_count} reviews
                  </Link>
                </div>
              </div>
              <div
                className={`tagline ${isSticky ? 'sticky' : ''}`}
                style={{ marginTop: isBuilt4Shopify ? '5px' : '0' }}
              >
                {infoApp && infoApp.detail.tagline}
              </div>
              <div className={`by ${isSticky ? 'sticky' : ''}`}>
                <span>by </span>
                <Link
                  href={
                    infoApp && infoApp.detail.partner
                      ? '/developer/' + infoApp.detail.partner.id.replace('/partners/', '')
                      : '#'
                  }
                  target="_blank"
                  prefetch={false}
                >
                  {infoApp && infoApp.detail.partner ? infoApp && infoApp.detail.partner.name : ''}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="add-compare">
        <Button
          type="primary"
          size={'large'}
          onClick={() => router.push(`${LayoutPaths.Auth}${Paths.LoginApp}`)}
          className="button-add-app"
          icon={<PlusOutlined />}
        >
          Add your app
        </Button>
        <Button
          type="primary"
          size={'large'}
          onClick={showModal}
          className="button-compare-app"
          icon={<SwapOutlined />}
        >
          Compare
        </Button>
      </div>
      <ModalCompareList visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} appId={id} infoApp={infoApp} />
    </div>
  );
}
