'use client';

import React, { useEffect, useState } from 'react';
import { Select as AntdSelect } from 'antd';
import classNames from 'classnames';
import './Select.scss';
import { getTotalPage, searchString } from '@/utils/functions';
import { useDebounce } from '@/hooks/hooks';
import { ETimeoutDebounce } from '@/common/enums';
import WrapperLazyLoad from '../wrapper-lazy-load/WrapperLazyLoad';

const Select = ({
  placeholder,
  disabled,
  options = [],
  showSearch = true,
  value,
  className,
  defaultValue,
  allowClear,
  dropdownClassName,
  paginate,
  onSearch,
  onLoadMore,
  onChange,
}) => {
  const [keyword, setKeyword] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const searchValueDebounce = useDebounce(keyword, ETimeoutDebounce.SEARCH);

  const filterOption = (input, option) => {
    return searchString(option.label, keyword);
  };

  const handleSearch = (keywordValue) => {
    setKeyword(keywordValue);
  };

  const dropdownRender = (menu) => {
    return (
      <div className={classNames('Select-dropdown', dropdownClassName)}>
        <div className="Select-dropdown-main">
          <WrapperLazyLoad maxHeight={256} onEnd={handleScrollEnd}>
            {menu}
          </WrapperLazyLoad>
        </div>
      </div>
    );
  };

  const handleScrollEnd = () => {
    if (onSearch && paginate) {
      const isLoadMore = paginate.page < getTotalPage(paginate.total, paginate.pageSize);
      if (isLoadMore) {
        onLoadMore?.();
      }
    }
  };

  const handleClear = () => {
    onChange?.(null);
  };

  useEffect(() => {
    if (isMounted && onSearch) {
      onSearch?.(searchValueDebounce);
    }

    setIsMounted(true);
  }, [searchValueDebounce]);

  return (
    <div className={classNames('Select', className)}>
      <AntdSelect
        className="Select-control"
        value={value}
        showSearch={showSearch}
        placeholder={placeholder}
        defaultValue={defaultValue}
        labelInValue
        allowClear={allowClear}
        filterOption={onSearch ? false : filterOption}
        onSearch={handleSearch}
        options={options}
        searchValue={keyword}
        dropdownClassName={classNames('Select-dropdown', dropdownClassName)}
        getPopupContainer={(trigger) => trigger}
        onChange={onChange}
        onClear={handleClear}
        dropdownRender={dropdownRender}
        disabled={disabled}
        virtual={false}
      />
    </div>
  );
};

export default Select;
