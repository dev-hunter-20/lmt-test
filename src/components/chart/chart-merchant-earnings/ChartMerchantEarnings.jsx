'use client';

import './ChartMerchantEarnings.scss';
import React from 'react';
import Earnings from './earnings/Earnings';
import MerchanGrowth from './merchant-growth/MerchanGrowth';

export default function ChartMerchantEarnings(props) {
  return (
    <div className="row-merchant-earnings">
      <MerchanGrowth props={props} />
      <Earnings props={props} />
    </div>
  );
}
