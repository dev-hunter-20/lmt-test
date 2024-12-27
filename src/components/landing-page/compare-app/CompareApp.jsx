'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import './CompareApp.scss';
import { Alert, Button, Empty, Tabs, Typography } from 'antd';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import { debounce } from 'lodash';
import Image from 'next/image';
import CompareAppService from '@/api-services/api/CompareAppApiService';
import InfoAppCompare from './info-app-compare/InfoAppCompare';
import RankingApp from './ranking/RankingApp';
import AppInfo from './app-info/AppInfo';
import PricingApp from './pricing/PricingApp';
import ReviewApp from './review/ReviewApp';
import PopularComparisons from './popular-comparisons/PopularComparisons';
import CustomSelect from '@/components/ui/tree-select/CustomSelect';
import { openNotificationWarning } from '@/utils/functions';
import Link from 'next/link';
import { ArrowRightOutlined } from '@ant-design/icons';

const defaultSelectedApps = [
  {
    app_id: 'judgeme',
    name: 'Judge.me Product Reviews App',
    icon: 'https://cdn.shopify.com/app-store/listing_images/8cada0f5da411a64e756606bb036f1ed/icon/CJmAj_a-5fQCEAE=.png',
  },
  {
    app_id: 'loox',
    name: 'Loox ‑ Product Reviews App',
    icon: 'https://cdn.shopify.com/app-store/listing_images/252ae7c55fa0e8a35df7f6ff3c8c1596/icon/CPLp1Kb0lu8CEAE=.jpg',
  },
];

export default function CompareApp() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedApps, setSelectedApps] = useState(defaultSelectedApps);
  const [showWarning, setShowWarning] = useState(false);
  const [compareAppData, setCompareAppData] = useState([]);
  const [appMap, setAppMap] = useState({});
  const [isInitialCompare, setIsInitialCompare] = useState(true);
  const [addedApps, setAddedApps] = useState([]);
  const [compareButtonHidden, setCompareButtonHidden] = useState(false);
  const [isWidth60, setIsWidth60] = useState(false);

  const dataAppHost = compareAppData[0]?.app_host.app_id || '';
  const dataAppCompare = compareAppData[1]?.app_compare.map((app) => app.app_id).join('-lmtvs-') || '';
  const appNames = [dataAppHost, ...dataAppCompare.split('-lmtvs-')];
  appNames.sort((a, b) => a.localeCompare(b));
  const sortedCompareApps = appNames.slice(1).join('-lmtvs-');
  const compareUrl = `/app/${appNames[0]}/compare-app/vs/${sortedCompareApps}`;

  const handleAppFromInfoAppCompare = (newApp) => {
    const isDuplicate = selectedApps.some((app) => app.app_id === newApp.app_id);

    if (isDuplicate) {
      openNotificationWarning();
      return;
    }

    const formattedApp = {
      ...newApp,
      icon: newApp.app_icon,
    };

    delete formattedApp.app_icon;

    setAddedApps((prevApps) => [...prevApps, formattedApp]);
    setSelectedApps((prevSelectedApps) => [...prevSelectedApps, formattedApp]);
  };

  const fetchDataCompareApp = async () => {
    if (selectedApps.length > 0) {
      const baseApp = selectedApps[0].app_id;
      const compareApps = selectedApps
        .slice(1)
        .map((app) => app.app_id)
        .join('-lmtvs-');
      try {
        const response = await CompareAppService.compareApps(baseApp, compareApps);
        setCompareAppData(response.data);
      } catch (error) {
        console.error('Failed to fetch comparison data:', error);
      }
    }
  };

  useEffect(() => {
    if (isInitialCompare && addedApps === undefined) {
      fetchDataCompareApp();
      setIsInitialCompare(false);
    } else if (addedApps !== undefined && selectedApps.length >= 2) {
      setShowWarning(false);
      fetchDataCompareApp();
    } else if (selectedApps.length > 0) {
      setShowWarning(true);
    }
  }, [isInitialCompare, addedApps]);

  useEffect(() => {
    if (selectedApps.length < 4 && compareButtonHidden) {
      setCompareButtonHidden(false);
    }
  }, [selectedApps.length, compareButtonHidden]);

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        setSearchLoading(true);
        try {
          const response = await SearchDataApiService.searchData(value, 1, 15);
          const apps = response.data.apps;

          if (apps.length === 0) {
            setSearchResults([
              {
                value: 'no-results',
                label: (
                  <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="No results found" className="no-results" />
                ),
              },
            ]);
          } else {
            const results = apps.map((app) => ({
              value: app.detail.app_id,
              label: (
                <div key={app.detail.app_id}>
                  {app.detail && app.detail.app_icon ? (
                    <Image src={app.detail.app_icon} alt={app.detail.name} width={35} height={35} />
                  ) : (
                    <Image src={'/image/no-image.webp'} alt={'no image'} width={35} height={35} className="no-image" />
                  )}
                  &nbsp;
                  <span>{app.detail.name}</span>
                </div>
              ),
            }));

            const newAppMap = apps.reduce((map, app) => {
              map[app.detail.app_id] = {
                app_id: app.detail.app_id,
                name: app.detail.name,
                icon: app.detail.app_icon,
              };
              return map;
            }, {});

            setSearchResults(results);
            setAppMap(newAppMap);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [],
  );

  const onSearchApp = useCallback(
    (value) => {
      setSearchLoading(true);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (value) => {
    if (Array.isArray(value)) {
      const updatedSelectedApps = value
        .filter((id) => appMap[id])
        .map((id) => ({
          app_id: appMap[id].app_id,
          name: appMap[id].name,
          icon: appMap[id].icon,
        }));

      setSelectedApps((prevSelectedApps) => {
        const newSelectedApps = [...prevSelectedApps];

        updatedSelectedApps.forEach((newApp) => {
          if (!newSelectedApps.find((app) => app.app_id === newApp.app_id)) {
            newSelectedApps.push(newApp);
          }
        });
        return newSelectedApps;
      });

      if (value.length >= 2) {
        setShowWarning(false);
      }
    } else if (value && typeof value === 'object' && value.value) {
      const id = value.value;

      if (appMap[id]) {
        const newApp = {
          app_id: appMap[id].app_id,
          name: appMap[id].name,
          icon: appMap[id].icon,
        };

        setSelectedApps((prevSelectedApps) => {
          const newSelectedApps = [...prevSelectedApps];

          if (!newSelectedApps.find((app) => app.app_id === newApp.app_id)) {
            newSelectedApps.push(newApp);
          }
          return newSelectedApps;
        });

        if (selectedApps.length >= 1) {
          setShowWarning(false);
        }
      }
    } else {
      console.error('Unexpected value format:', value);
    }
  };

  const handleCompareClick = () => {
    if (selectedApps.length < 2) {
      setShowWarning(true);
    } else {
      fetchDataCompareApp();
      if (selectedApps.length === 4) {
        setCompareButtonHidden(true);
        setIsWidth60(true);
      } else {
        setIsWidth60(false);
      }
    }
  };

  const items = [
    { label: 'Ranking', key: '1', children: <RankingApp compareAppData={compareAppData || []} /> },
    { label: 'App Info', key: '2', children: <AppInfo compareAppData={compareAppData || []} /> },
    { label: 'Pricing', key: '3', children: <PricingApp compareAppData={compareAppData || []} /> },
    { label: 'Review', key: '4', children: <ReviewApp compareAppData={compareAppData || []} /> },
    { label: 'Popular Comparisons', key: '5', children: <PopularComparisons compareAppData={compareAppData || []} /> },
  ];

  const handleDeselect = (item) => {
    setSelectedApps((prevApps) => prevApps.filter((app) => app.app_id !== item.app_id));
    setIsWidth60(false);
  };

  return (
    <>
      <div className="compare-app-head">
        <Typography.Title className="primary-color" level={3}>
          Compare Apps
        </Typography.Title>
        <Typography.Text style={{ fontSize: '42px' }}>Unlock product insights</Typography.Text>
      </div>
      <div className="container-compare_apps container" id="compare">
        <div className="compare-header">
          <div className="top">
            <div className={`${showWarning ? 'isAlert' : 'search-app_compare'} ${isWidth60 ? 'width-60' : ''}`}>
              <div className="input-search">
                <CustomSelect
                  options={searchResults}
                  selectedItems={selectedApps}
                  onSearch={onSearchApp}
                  onSelect={handleSelect}
                  onDeselect={handleDeselect}
                  placeholder="Search and select apps"
                  searchPlaceholder="Search apps..."
                  searchLoading={searchLoading}
                  onCompareClick={handleCompareClick}
                  disableSearch={selectedApps.length >= 4}
                  hideCompareButton={compareButtonHidden}
                />
              </div>
              <div className="show-alert">
                {showWarning && <Alert message="Please enter 2 or more apps to compare" type="warning" />}
              </div>
            </div>
          </div>
          {/* <div className="bottom">
            <InfoAppCompare compareAppData={compareAppData || []} onAppAdd={handleAppFromInfoAppCompare} />
          </div> */}
        </div>
        <div className="content-tab_compare">
          <Link href={compareUrl} className="see-more_compare" target="_blank">
            See more <ArrowRightOutlined />
          </Link>
          <Tabs defaultActiveKey="1" items={items} type="card" />
        </div>
        <div className="see-more-compare">
          <Link href={compareUrl} target="_blank">
            <Button className="wrapper__button mt-30" type="primary">
              See more
            </Button>
          </Link>
        </div>
      </div>
    </>
  );
}
