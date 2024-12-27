'use client';

import React, { useState } from 'react';
import './PricingApp.scss';
import { Switch, Table, Tag, Tooltip } from 'antd';
import Link from 'next/link';
import { BASE_URL } from '@/common/constants';
import Image from 'next/image';
import { StarFilled } from '@ant-design/icons';

export default function PricingApp({ compareAppData }) {
  const [isChecked, setIsChecked] = useState(false);

  const extractYearlyPrice = (text) => {
    if (text) {
      const match = text.match(/\$\d+(\.\d{1,2})?/);
      return match ? match[0] : text;
    } else {
      return '';
    }
  };

  const transposedDataPricing = [
    {
      key: 'pricingOptions',
      title: 'Pricing Options',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        const { just_paid, freemium, free } = item;

        const renderPricing = () =>
          just_paid && freemium && !free ? (
            <>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Subscription
              </li>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free plan ( Limited Features )
              </li>
            </>
          ) : free && freemium ? (
            <>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free trial
              </li>
              <li>
                <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
                Free plan ( Limited Features )
              </li>
            </>
          ) : !free && freemium && !just_paid ? (
            <li>
              <Image src="/image/check-icon.png" width={40} height={40} alt="icon-check" />
              Free plan ( Limited Features )
            </li>
          ) : (
            <li>
              <Image src="/image/check-icon-error.png" width={40} height={40} alt="icon-check" />
              No free trial
            </li>
          );

        return (
          <div className="text-options" key={item.app_id}>
            <div className="options">
              <b className="starts">Starts from </b>
              {item.pricing_max ? (
                <span>
                  <b>{item.pricing_min.split('/')[0]}</b>
                </span>
              ) : (
                <b className="free">Free</b>
              )}
            </div>
            <div className="pricing">
              <ul>
                <div className="check">{renderPricing()}</div>
              </ul>
            </div>
          </div>
        );
      }),
    },
    {
      key: 'pricingPlans',
      title: (
        <div className="title-pricing_plan">
          Pricing Plans
          <div className="isCheck">
            <span className={isChecked ? '' : 'text-yellow'}>Monthly</span>&nbsp;
            <Switch defaultChecked={isChecked} onChange={(checked) => setIsChecked(checked)} />
            &nbsp;
            <span className={isChecked ? 'text-yellow' : ''}>Yearly</span>
          </div>
        </div>
      ),
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => {
        const { pricing_plan } = item.detail;

        if (!pricing_plan || pricing_plan.length === 0) {
          return (
            <span key={`no-pricing-${item.app_id}`} className="no-shopify">
              ...................
            </span>
          );
        }

        const filteredPlans = pricing_plan.filter((plan) => {
          if (isChecked) {
            return plan.yearly !== null && plan.yearly;
          } else {
            return plan.pricing && plan.pricing !== null;
          }
        });

        if (filteredPlans.length === 0) {
          return (
            <span key={`no-pricing-${item.app_id}`} className="no-shopify">
              ...................
            </span>
          );
        }

        return filteredPlans.map((plan) => (
          <div key={`plan-${isChecked ? 'yearly' : 'monthly'}-${plan.id || plan.title}`} className="plan">
            <Tag className="tag-pricing" color="orange">
              <span className="text-plan">{plan.title}</span>
              <span className="price">
                {isChecked
                  ? `${extractYearlyPrice(plan.yearly)} /year`
                  : `${extractYearlyPrice(plan.pricing)}${
                      plan.pricing !== 'Free' && plan.pricing !== 'Free to install' ? ' /month' : ''
                    }`}
              </span>
            </Tag>
          </div>
        ));
      }),
    },
    {
      key: 'viewPricingPlans',
      title: 'View Pricing Plans',
      values: [compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item) => (
        <div key={item.app_id} className="view-pricing">
          <Link href={`${BASE_URL}app/${item.detail.app_id}/pricing`} target={`_blank${item.app_id}`} key={item.app_id}>
            View Pricing plans
          </Link>
        </div>
      )),
    },
  ];

  const columnsPricing = [
    {
      title: 'Apps',
      dataIndex: 'title',
      key: 'title',
      fixed: 'left',
      width: 200,
    },
    ...[compareAppData[0].app_host, ...compareAppData[1].app_compare].map((item, index) => {
      return {
        title: (
          <div className="app">
            <div className="image">
              <Image src={item.detail.app_icon} width={90} height={90} alt="Icon App" />
            </div>
            <div className="title-app">
              <Tooltip title={item.detail.name}>
                <span className="app-name">{item.detail.name}</span>
              </Tooltip>
              <div className="rating">
                <span className="star">
                  <StarFilled />
                  {item.detail.star}
                </span>
                <span>&nbsp;|&nbsp;</span>
                <Link prefetch={false} href={`${BASE_URL}app/${item.detail.app_id}/reviews`} className="review-count">
                  {item.detail.review_count} reviews
                </Link>
              </div>
              <Link
                href={`${BASE_URL}app/${item.detail.app_id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="view-detail"
              >
                View Details
              </Link>
            </div>
          </div>
        ),
        dataIndex: `value${index}`,
        key: `value${index}`,
        width: 347,
      };
    }),
  ];

  const dataSourcePricing = transposedDataPricing.map((row) => {
    const rowData = { key: row.key, title: row.title };
    row.values.forEach((value, index) => {
      rowData[`value${index}`] = value;
    });
    return rowData;
  });

  return (
    <div className="app-pricing">
      <Table
        dataSource={dataSourcePricing}
        columns={columnsPricing}
        pagination={false}
        scroll={{ x: 1500 }}
        className="table-app"
      />
    </div>
  );
}
