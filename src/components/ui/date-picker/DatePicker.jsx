'use client';

import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import classNames from 'classnames';
import './DatePicker.scss';
import { EFormat } from '@/common/enums';

const { RangePicker } = AntdDatePicker;

const DatePicker = ({
  className,
  picker,
  allowClear,
  format,
  value,
  placeholder,
  disabled,
  disabledDate,
  getPopupContainer,
  onChange,
}) => {
  const props = {
    format: format || EFormat.DATE,
    value,
    placeholder,
    disabled,
    onChange,
    allowClear,
    disabledDate,
    getPopupContainer: getPopupContainer || ((trigger) => trigger),
  };
  return (
    <div className={classNames('DatePicker', className)}>
      {picker === 'range' ? <RangePicker {...props} /> : <AntdDatePicker {...props} />}
    </div>
  );
};

export default DatePicker;
