'use client';

import React from 'react';
import { ChartWeeklyCategory } from './chart-weekly-category/ChartWeeklyCategory';

export default function ChartCategory(props) {
  return (
    <>
      <div className="chart-weekly-categories-best-match">
        <ChartWeeklyCategory loading={props.loading} value={props.dataBestMatch} />
      </div>
      <div className="chart-weekly-categories-popular">
        <ChartWeeklyCategory
          loading={props.loading}
          value={props.dataPopular}
          title={'Category Popular Positional Changes'}
        />
      </div>
    </>
  );
}
