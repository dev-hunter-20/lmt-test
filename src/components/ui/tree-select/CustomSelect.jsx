'use client';

import React, { useState, useEffect, useRef } from 'react';
import './CustomSelect.scss';
import Image from 'next/image';
import { Button, Spin, Tag, Tooltip } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import { openNotificationWarning } from '@/utils/functions';

const CustomSelect = ({
  options,
  selectedItems,
  onSearch,
  onSelect,
  onDeselect,
  placeholder,
  searchPlaceholder,
  searchLoading,
  onCompareClick,
  disableSearch,
  hideCompareButton,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef(null);
  const [lastSearchResults, setLastSearchResults] = useState([]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (onSearch) {
      onSearch(value);
    }
    setIsOpen(true);
  };

  const toggleDropdown = () => {
    if (!disableSearch) {
      setIsOpen(!isOpen);
      if (searchTerm === '' && lastSearchResults.length > 0) {
        setIsOpen(true);
      }
    }
  };

  const handleSelectItem = (item) => {
    const isAlreadySelected = selectedItems.some((selectedItem) => selectedItem.app_id === item.value);
    const isInLastSearchResults = lastSearchResults.some((searchResult) => searchResult.app_id === item.value);

    if (isAlreadySelected || isInLastSearchResults) {
      openNotificationWarning();
      return;
    }

    if (disableSearch) return;

    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm('');
    setIsOpen(false);
    setLastSearchResults([...options]);
  };

  const handleDeselectItem = (item) => {
    if (onDeselect) {
      onDeselect(item);
      setIsOpen(false);
    }
  };

  const handleClearAll = () => {
    selectedItems.forEach((item) => handleDeselectItem(item));
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const visibleItems = selectedItems.slice(0, 4);

  return (
    <div className="custom-select-container" ref={containerRef}>
      <div className="search-box step5" onClick={toggleDropdown}>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={isOpen ? searchPlaceholder : placeholder}
          disabled={disableSearch}
          className={selectedItems.length >= 4 ? 'hidden' : ''}
        />
        <div className="tags-container" onClick={(e) => e.stopPropagation()}>
          {visibleItems.map((item) => (
            <Tag key={item.app_id} closable onClose={() => handleDeselectItem(item)} className="custom-tag">
              <Image src={item.icon} alt={item.name} width={35} height={35} />
              <Tooltip title={item.name}>
                <span className="tag-name">{item.name}</span>
              </Tooltip>
            </Tag>
          ))}
        </div>
        {visibleItems.length > 0 && (
          <div className="clear-all-button">
            <Tooltip title="Clear all">
              <CloseOutlined onClick={handleClearAll} />
            </Tooltip>
          </div>
        )}
      </div>

      {isOpen && (searchTerm || lastSearchResults.length > 0) && (
        <div className="dropdown-menu">
          {searchLoading ? (
            <div className="loading-container">
              <Spin size="small" />
            </div>
          ) : options.length === 0 ? (
            <div className="no-results">No results found</div>
          ) : (
            <ul>
              {(searchTerm ? options : lastSearchResults).map((item) => (
                <li key={item.value} onClick={() => handleSelectItem(item)}>
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {!(selectedItems.length >= 4 && hideCompareButton) && (
        <div className="compare-button-container" id="step7">
          <Button
            type="primary"
            onClick={() => {
              onCompareClick();
              setIsOpen(false);
            }}
            className="btn-compare_app"
          >
            Compare
          </Button>
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
