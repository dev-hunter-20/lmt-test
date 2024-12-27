'use client';

import React, { useEffect, useRef, useState } from 'react';
import LayoutDetailApp from '../../_components/detaill-app-not-logged/LayoutDetailApp';
import './PricingContent.scss';
import { useParams } from 'next/navigation';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { Card, Empty, Spin, Switch } from 'antd';
import Image from 'next/image';
import { SwapOutlined } from '@ant-design/icons';
import Link from 'next/link';

export default function PricingContent() {
  const [loadingAppInfo, setLoadingAppInfo] = useState(false);
  const [infoApp, setInfoApp] = useState();
  const AppName = useRef('');
  const params = useParams();
  const idDetail = params.app_id;
  const [id, setId] = useState(idDetail);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const getAppInfomation = async (id) => {
      setLoadingAppInfo(true);
      try {
        const appInfo = await DetailAppApiService.getAppInfo(id);
        setInfoApp({
          isBuilt4Shopify: appInfo.data.detail.built_for_shopify,
          data: appInfo.data,
        });
        AppName.current = appInfo.data.detail.name;
      } catch (error) {
        console.error('Error fetching app information:', error);
      } finally {
        setLoadingAppInfo(false);
      }
    };

    getAppInfomation(id);
  }, [id]);

  const renderDescription = (text) => {
    if (!text) {
      return null;
    }

    return text.split('\n').map((item, index) => {
      if (item.trim() === '') {
        return null;
      }
      return (
        <div key={index}>
          {item.trim() && <Image src={'/image/check-icon.png'} alt="check-icon" width={30} height={30} />}
          {item}
        </div>
      );
    });
  };

  const dataAppInfo =
    infoApp?.data?.detail?.pricing_plan?.map((pricingPlan) => {
      return {
        title: pricingPlan.title,
        pricing: pricingPlan.pricing,
        yearly: pricingPlan.yearly,
        desc: pricingPlan.desc,
        free_trial: pricingPlan.free_trial,
      };
    }) || [];

  const renderPricing = (pricing) => {
    const { free, freemium, just_paid } = pricing;

    return just_paid && freemium && !free ? (
      <>
        <li>
          <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
          Free plan ( Limited Features )
        </li>
        <li>
          <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
          Subscription
        </li>
      </>
    ) : free && freemium ? (
      <li>
        <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
        Free
      </li>
    ) : !free && freemium && !just_paid ? (
      <li>
        <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
        Free plan ( Limited Features )
      </li>
    ) : (
      <li>
        <Image src="/image/check-icon-error.png" width={40} height={40} alt="icon-check" />
        No free
      </li>
    );
  };

  const competitorPricingRender = () => {
    const dataCompare = infoApp?.data?.app_compare?.flatMap((item) => item.top_3_apps) || [];
    const uniqueApps = Array.from(new Set(dataCompare.map((app) => app.app_id))).map((appId) => {
      return dataCompare.find((app) => app.app_id === appId);
    });
    const filteredDataApps = uniqueApps.filter((item) => item.app_id !== idDetail);

    const maxApps = [9, 6, 3].find((n) => filteredDataApps.length >= n) || filteredDataApps.length;
    const appsToShow = filteredDataApps.slice(0, maxApps);

    return (
      <>
        {appsToShow && appsToShow.length > 0 ? (
          appsToShow.map((item) => {
            const appNames = [infoApp.data.app_id, item.app_id];
            appNames.sort((a, b) => a.localeCompare(b));
            const compareUrl = `/app/${appNames[0]}/compare-app/vs/${appNames[1]}`;

            return (
              <div key={item.app_id} className="content-app">
                <div className="app">
                  <div className="app-icon-pricing">
                    <Image src={item.detail?.app_icon} alt={item.detail?.name} width={80} height={80} />
                    <div className="app_name">
                      <span>{item.detail?.name}</span>
                    </div>
                    <div className="info">
                      <span className="text-app">Price starts from</span>
                      <span>
                        {item.app_pricing.pricing_min !== null ? item.app_pricing.pricing_min : 'Pricing not available'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="trial">
                  <div className="free-trial">
                    <span className="text-pricing-app">Free Trial</span>
                    {item.app_pricing.free ? (
                      <div>
                        <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                        Available
                      </div>
                    ) : (
                      <div>
                        <Image src="/image/check-icon-error.png" width={40} height={40} alt="icon-check" />
                        Not available
                      </div>
                    )}
                  </div>
                  <div className="options">
                    <span className="text-pricing-app">Pricing Options</span>
                    <ul>{renderPricing(item.app_pricing)}</ul>
                  </div>
                </div>
                <div className="action">
                  <Link href={compareUrl} className="button-compare-app btn-compare-detail" target="__blank">
                    <SwapOutlined />
                    Compare
                  </Link>
                  <Link href={`/app/${item.app_id}`} className="button-add-app btn-compare-detail" target="__blank">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data-pricing">
            <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
          </div>
        )}
      </>
    );
  };

  const extractYearlyPrice = (text) => {
    if (text) {
      const match = text.match(/\$\d+(\.\d{1,2})?/);
      return match ? match[0] : text;
    } else {
      return '';
    }
  };

  return (
    <LayoutDetailApp>
      <Spin spinning={loadingAppInfo}>
        {infoApp && infoApp.data.detail ? (
          <div className="container-pricing">
            <h1>{infoApp && infoApp.data && infoApp.data.detail.name} Pricing</h1>
            <div className="pricing-content">
              <div className="pricing-option">
                {infoApp && infoApp.data && infoApp.data.app_pricing ? (
                  <div className="content-trial">
                    <div className="free-trial">
                      <span className="text-pricing">Free Trial</span>
                      {infoApp.data.app_pricing.free ? (
                        <div>
                          <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                          Available
                        </div>
                      ) : (
                        <div>
                          <Image src="/image/check-icon-error.png" width={40} height={40} alt="icon-check" />
                          Not available
                        </div>
                      )}
                    </div>

                    <div className="options">
                      <span className="text-pricing">Pricing Options</span>
                      <ul>{renderPricing(infoApp.data.app_pricing)}</ul>
                    </div>
                  </div>
                ) : (
                  <p>No pricing information available</p>
                )}
              </div>
              <div className="pricing-plans">
                <span className="text-pricing">Pricing Plans</span>
                {dataAppInfo && dataAppInfo.length > 0 ? (
                  <>
                    <div className="isCheck">
                      <span className={isChecked ? '' : 'text-yellow'}>Monthly plans</span>&nbsp;
                      <Switch defaultChecked={isChecked} onChange={(checked) => setIsChecked(checked)} />
                      &nbsp;
                      <span className={isChecked ? 'text-yellow' : ''}>Yearly plans</span>
                    </div>
                    <div className="option">
                      {isChecked ? (
                        dataAppInfo.some((plan) => plan.yearly !== null) ? (
                          dataAppInfo.map((plan, index) =>
                            plan.yearly !== null ? (
                              <Card
                                key={index}
                                title={plan.title}
                                className="pricing-card"
                                extra={<div>{plan.free_trial && `${plan.free_trial}`}</div>}
                              >
                                <p className="price-title">{`${extractYearlyPrice(plan.yearly)} /year`}</p>
                                <div>{renderDescription(plan.desc)}</div>
                              </Card>
                            ) : null,
                          )
                        ) : (
                          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="Yearly plan not available" />
                        )
                      ) : dataAppInfo.some((plan) => plan.pricing !== null) ? (
                        dataAppInfo.map((plan, index) =>
                          plan.pricing !== null ? (
                            <Card
                              key={index}
                              title={plan.title}
                              className="pricing-card"
                              extra={<div>{plan.free_trial && `${plan.free_trial}`}</div>}
                            >
                              <p className="price-title">
                                {extractYearlyPrice(plan.pricing)}{' '}
                                {plan.pricing !== 'Free' && plan.pricing !== 'Free to install' ? '/month' : ''}
                              </p>
                              <div>{renderDescription(plan.desc)}</div>
                            </Card>
                          ) : null,
                        )
                      ) : (
                        <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="Monthly plan not available" />
                      )}
                    </div>
                  </>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
                )}
              </div>
              <div className="compare">
                <h2>Competitor pricing</h2>
                <div className="content-compare-pricing">{competitorPricingRender()}</div>
              </div>
            </div>
          </div>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} />
        )}
      </Spin>
    </LayoutDetailApp>
  );
}
