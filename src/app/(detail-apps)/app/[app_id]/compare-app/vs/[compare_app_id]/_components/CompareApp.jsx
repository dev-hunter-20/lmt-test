'use client';

import CompareAppService from '@/api-services/api/CompareAppApiService';
import { BASE_URL } from '@/common/constants';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Breadcrumb, message, Popover, Spin, Tooltip } from 'antd';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import './CompareApp.scss';
import Compare from './compare/Compare';
import AppInfo from './app-info/AppInfo';
import Auth from '@/utils/store/Authentication';
import { LayoutPaths, Paths } from '@/router';
import Image from 'next/image';

const AppRanking = dynamic(() => import('./app-ranking/AppRanking'), { ssr: false });
const AppPricing = dynamic(() => import('./app-pricing/AppPricing'), { ssr: false });
const AppReview = dynamic(() => import('./app-review/AppReview'), { ssr: false });
const PopularComparisons = dynamic(() => import('./popular-comparisons/PopularComparisons'), { ssr: false });

export default function CompareApp() {
  const [compareAppData, setCompareAppData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const match = pathname.match(/\/app\/([^\/]+)\/compare-app\/vs\/(.+)/);
  const router = useRouter();
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!Auth.getAccessToken());
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!Auth.getAccessToken());
  }, [Auth.getAccessToken()]);

  useEffect(() => {
    if (isAuthenticated) {
      const comparisonLists = JSON.parse(localStorage.getItem('COMPARISON_LISTS')) || [];
      if (comparisonLists.includes(pathname)) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    } else {
      setIsSaved(false);
    }
  }, [pathname, isAuthenticated]);

  const handleSaveCompare = () => {
    if (!isAuthenticated) {
      setIsPopoverVisible(true);
    } else {
      const comparisonLists = JSON.parse(localStorage.getItem('COMPARISON_LISTS')) || [];
      if (!comparisonLists.includes(pathname)) {
        comparisonLists.push(pathname);
        localStorage.setItem('COMPARISON_LISTS', JSON.stringify(comparisonLists));
        message.success('App comparison saved successfully');
        setIsSaved(true);
        router.refresh();
      } else {
        setIsPopoverVisible(true);
      }
    }
  };

  const popoverContent = isSaved ? (
    <>
      <span className="text-link_login">
        <Link href="/compared-apps-list" style={{ textDecoration: 'underline', fontWeight: 500 }}>
          View
        </Link>{' '}
        the saved list of compared apps
      </span>
    </>
  ) : (
    <>
      <span className="text-link_login">
        <Link href={`${LayoutPaths.Auth}${Paths.LoginApp}`} style={{ textDecoration: 'underline', fontWeight: 500 }}>
          Log in
        </Link>{' '}
        to your account to save the app comparison.
      </span>
    </>
  );

  const handleBack = () => {
    router.back();
  };

  const fetchDataCompareApp = async () => {
    if (match) {
      const baseApp = match[1];
      const compareApp = match[2];
      try {
        const response = await CompareAppService.compareApps(baseApp, compareApp);
        setCompareAppData(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching comparison data:', error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchDataCompareApp();
  }, [pathname]);

  if (isLoading) {
    return (
      <div className="loading-compare">
        <Spin />
      </div>
    );
  }

  const MAX_TEXT_LENGTH = 50;
  const renderNameCompetitor = compareAppData[1].app_compare.map((item) => item.app_name).join(' vs ');
  const truncatedRenderNameCompetitor =
    renderNameCompetitor.length > MAX_TEXT_LENGTH
      ? renderNameCompetitor.substring(0, MAX_TEXT_LENGTH) + '...'
      : renderNameCompetitor;

  const renderAppNameWithTooltip = <Tooltip title={renderNameCompetitor}>{truncatedRenderNameCompetitor}</Tooltip>;

  return (
    <div className="container-compare_app">
      <div className="compare-app-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item className="link">
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              <Link prefetch={false} href={`${BASE_URL}app/${compareAppData[0]?.app_host.app_id}`}>
                {compareAppData[0].app_host.app_name}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item className="link">Compare</Breadcrumb.Item>
            <Breadcrumb.Item className="link">{renderAppNameWithTooltip}</Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="content-compare container">
        <Tooltip title={renderNameCompetitor} visible={isTooltipVisible}>
          <h1 onMouseEnter={() => setTooltipVisible(true)} onMouseLeave={() => setTooltipVisible(false)}>
            {compareAppData[0]?.app_host?.app_name || '..........'} Compare {truncatedRenderNameCompetitor}
          </h1>
        </Tooltip>

        <div className="save-compare">
          <Popover
            content={popoverContent}
            title=""
            trigger="click"
            visible={isPopoverVisible}
            onVisibleChange={(visible) => setIsPopoverVisible(visible)}
            placement="bottom"
            onClick={handleSaveCompare}
          >
            {isSaved ? (
              <Image src={'/image/heart-red.png'} width={17} height={17} alt="icon heart" className="icon-heart" />
            ) : (
              <>
                <Image src={'/image/heart.png'} width={17} height={15} alt="icon heart" className="icon-heart" />
              </>
            )}
            {isSaved ? 'Saved' : 'Save'}
          </Popover>
        </div>

        <Compare compareAppData={compareAppData} />
        <AppInfo compareAppData={compareAppData} />
        <AppRanking compareAppData={compareAppData} />
        <AppPricing compareAppData={compareAppData} />
        <AppReview compareAppData={compareAppData} />
        <PopularComparisons compareAppData={compareAppData} />
      </div>
    </div>
  );
}
