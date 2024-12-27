'use client';

import React, { useEffect, useRef, useState } from 'react';
import './DetailAppPage.scss';
import Auth from '@/utils/store/Authentication';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { dataKeywords, mergedObject, openNotification } from '@/utils/functions';
import WatchingAppsCurrent from '@/utils/store/WatchingAppsCurrent';
import { useParams } from 'next/navigation';
import dayjs from 'dayjs';
import LayoutDetailApp from '../detaill-app-not-logged/LayoutDetailApp';
import dynamic from 'next/dynamic';

const ProductApp = dynamic(() => import('./product/ProductApp'), {
  ssr: false,
});
const ProductPage = dynamic(() => import('../detaill-app-not-logged/product/ProductPage'), {
  ssr: false,
});

export default function DetailAppPage() {
  const { app_id: idDetail } = useParams();
  const [loadingAppInfo, setloadingAppInfo] = useState(false);
  const [infoApp, setInfoApp] = useState();
  const [isFollow, setIsFollow] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [activeState, setActiveState] = useState(1);
  const [competitor, setCompetitor] = useState();
  const [dataDetailApp, setDataDetailApp] = useState();
  const [loadingCatCollection, setloadingCatCollection] = useState(false);
  const [dataCatCollection, setDataCatCollection] = useState();
  const [dataAllTab, setDataAllTab] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataByDate, setDataByDate] = useState([]);
  const [dataCustomLifecycle, setDataCustomLifecycle] = useState([]);
  const [retentionData, setRetentionData] = useState([]);
  const [countKeyword, setCountKeyword] = useState(0);
  const [dataKeywordsChange, setDataKeywordsChange] = useState();
  const [keywordPosition, setKeywordPosition] = useState([]);
  const [dataKeywordsShow, setDataKeywordsShow] = useState([]);
  const [loadingChangeLanguage, setloadingChangeLanguage] = useState(false);
  const [id, setId] = useState(idDetail);
  const isLogged = Auth.getAccessToken();
  const AppName = useRef('');
  const [isCheck, setIsCheck] = useState(false);
  const [selectedValue, setSelectedValue] = useState('D');
  const isAuth = Auth.isAuthenticated();
  const [language, setLanguage] = useState('uk');

  useEffect(() => {
    if (id) {
      fetchInfoApp(id);
    }
    setIsCheck(true);
  }, []);

  const getAppInfomation = async (id, fromDate, toDate, isNewTab) => {
    const appInfo = await (isLogged
      ? DetailAppApiService.getAppInfoLogged(id, fromDate, toDate)
      : DetailAppApiService.getAppInfo(id, fromDate, toDate));

    const watchingAppData = {
      app_icon: appInfo?.data?.detail?.app_icon,
      app_id: appInfo?.data?.detail?.app_id,
      built_for_shopify: appInfo?.data?.detail?.built_for_shopify,
      highlights: appInfo?.data?.detail?.highlights,
      name: appInfo?.data?.detail?.name,
      review_count: appInfo?.data?.detail?.review_count,
      star: appInfo?.data?.detail?.star,
      pricing: appInfo?.data?.detail?.pricing,
      tagline: appInfo?.data?.detail?.tagline,
    };

    if (!isNewTab) {
      if (appInfo.data.delete || appInfo.data.unlisted) {
        openNotification(appInfo.data.delete);
      }
      setloadingAppInfo(false);
      setInfoApp({
        isBuilt4Shopify: appInfo.data.detail.built_for_shopify,
        data: appInfo.data,
        isOwner: appInfo.is_owner,
        gaConnected: appInfo.ga_connected,
        partnerConnected: appInfo.shopify_connected,
        canAddGId: appInfo.must_add_shopify_app_id,
      });
      setIsFollow(appInfo.is_follow);
      setFromDate(appInfo.start_date);
      setToDate(appInfo.end_date);
      AppName.current = appInfo.data.detail.name;
      WatchingAppsCurrent.addToListWatchingApps(watchingAppData);
      const panes = [
        {
          appId: appInfo.data.app_id,
          title: {
            ...appInfo,
            built_for_shopify: appInfo.data.detail.built_for_shopify,
            name: appInfo.data.detail.name || '',
          },
          content: <></>,
          changed: appInfo.changed,
          name: appInfo.data.detail.name || '',
          isFollow: {
            appId: appInfo.data.app_id,
            isFollow: appInfo.is_follow,
          },
          key: '1',
          closable: false,
        },
      ];
      if (appInfo.competitor) {
        appInfo.competitor.map((item) => {
          const activeKey = (panes && panes.length ? +panes[panes.length - 1].key : 0) + 1;
          panes.push({
            appId: item.app_id,
            title: {
              ...item,
              name: item.name,
            },
            content: <></>,
            changed: item.changed,
            name: item.name || '',
            isFollow: {
              appId: item.app_id,
              isFollow: item.is_follow,
            },
            key: activeKey,
          });
        });
      }
      setActiveState(panes[0].key);
      setCompetitor(panes);
    }
    return appInfo;
  };

  const getCatCollectionPos = async (id, fromDate, toDate) => {
    setloadingCatCollection(true);
    const [dataCategory, dataCollection] = await Promise.all([
      DetailAppApiService.getCategoryPosition(id, fromDate, toDate),
      DetailAppApiService.getCollectionPosition(id, fromDate, toDate),
    ]);
    setloadingCatCollection(false);
    setDataCatCollection({
      dataCategory: dataCategory.data,
      dataCollection: dataCollection.data,
    });
    return { dataCategory, dataCollection };
  };

  const getAppInfo = async (id, fromDate, toDate, isNewTab) => {
    setloadingAppInfo(true);
    const [ratingChange, reviewsChange, changeLog, dataCategoryPos, appInfo, catCollectionPos] = await Promise.all([
      DetailAppApiService.getRatingChange(id, fromDate, toDate),
      DetailAppApiService.getReviewsChange(id, fromDate, toDate),
      DetailAppApiService.getChangeLog(id, fromDate, toDate),
      DetailAppApiService.getCategoryPositionChange(id, fromDate, toDate),
      getAppInfomation(id, fromDate, toDate, isNewTab),
      getCatCollectionPos(id, fromDate, toDate),
    ]);
    setloadingAppInfo(false);
    setDataDetailApp({
      dataCategoryPos: dataCategoryPos.data,
      ratingChange: ratingChange.data,
      reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
      changeLog: changeLog.data,
    });
    const dataFetchTab = {
      dataCategory: catCollectionPos.dataCategory.data,
      dataCollection: catCollectionPos.dataCollection.data,
      dataCategoryPos: dataCategoryPos.data,
      ratingChange: ratingChange.data,
      reviewsChange: reviewsChange.data.filter((item) => item.type === 'Review'),
      changeLog: changeLog.data,
      appInfo: appInfo,
      resultCheck: appInfo && appInfo.data.detail.built_for_shopify,
    };
    return dataFetchTab;
  };

  const asyncKeywordByLanguage = async (id, language, fromDate, toDate, compare_app_id) => {
    const [dataKey, dataKeyChangeBestMatch, dataKeyChangeMostPopular] = await Promise.all([
      DetailAppApiService.getPositionKeywordByLang(id, language, fromDate, toDate, compare_app_id),
      DetailAppApiService.getPositionKeywordChangeByLang(id, language, 'best_match', fromDate, toDate, compare_app_id),
      DetailAppApiService.getPositionKeywordChangeByLang(id, language, 'popular', fromDate, toDate, compare_app_id),
    ]);
    setDataKeywordsChange({
      bestMatch: dataKeyChangeBestMatch.data,
      popular: dataKeyChangeMostPopular.data,
    });
    if (dataKey.data.result.length > 0) {
      setKeywordPosition(dataKey.data.result);
      setDataKeywordsShow(dataKeywords(dataKey.data.result));
    }
    setloading(false);
    setloadingChangeLanguage(false);
    return { dataKey, dataKeyChangeBestMatch, dataKeyChangeMostPopular };
  };

  const getAppInfoLogged = async (id, fromDate, toDate, compare_app_id) => {
    setloading(true);
    const appId = compare_app_id ? compare_app_id : id;
    const [
      gaData,
      dataEarning,
      dataInstall,
      dataUninstall,
      dataMerchant,
      keywordPositionByLanguage,
      dataRetension,
      dataEarningbyPlan,
      dataUninstallTime,
      dataReinstallShopByTime,
    ] = await Promise.all([
      DetailAppApiService.getGaData(appId, fromDate, toDate),
      DetailAppApiService.getEarning(appId, fromDate, toDate),
      DetailAppApiService.getInstallApp(appId, fromDate, toDate),
      DetailAppApiService.getUninstallApp(appId, fromDate, toDate),
      DetailAppApiService.getMerchantApp(appId, fromDate, toDate),
      asyncKeywordByLanguage(id, 'uk', fromDate, toDate, compare_app_id),
      DetailAppApiService.getRetensionApp(appId, fromDate, toDate),
      DetailAppApiService.getEarningByPlan(appId, fromDate, toDate),
      DetailAppApiService.getUninstallByTime(appId, fromDate, toDate),
      DetailAppApiService.getReinstallShopByTime(appId),
    ]);
    const resultChart = {
      earning_by_date: dataEarning.data?.earning_by_date,
      install_by_date: dataInstall.data,
      merchant_by_date: dataMerchant.data,
      total_earning: dataEarning.data?.total_earning,
      total_earning_before: dataEarning.data?.total_earning_before,
      uninstall_by_date: dataUninstall.data,
      earning_by_pricing: dataEarningbyPlan.data,
      uninstalled_shop_1_14_days: dataUninstallTime.data?.uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days: dataUninstallTime.data?.uninstalled_shop_15_90_days,
      uninstalled_shop_91_days: dataUninstallTime.data?.uninstalled_shop_91_days,
      uninstalled_shop_the_same_day: dataUninstallTime.data?.uninstalled_shop_the_same_day,
      average_diff_days_15_90_days: dataUninstallTime.data?.average_diff_days_15_90_days,
      average_diff_days_1_14_days: dataUninstallTime.data?.average_diff_days_1_14_days,
      average_diff_days_same_day: dataUninstallTime.data?.average_diff_days_same_day,
      dataRetension: dataRetension.data,
      reinstalled_shop_1_14_days: dataReinstallShopByTime.data?.reinstalled_shop_1_14_days,
      reinstalled_shop_15_90_days: dataReinstallShopByTime.data?.reinstalled_shop_15_90_days,
      reinstalled_shop_91_days: dataReinstallShopByTime.data?.reinstalled_shop_91_days,
      reinstalled_shop_the_same_day: dataReinstallShopByTime.data?.reinstalled_shop_the_same_day,
      re_average_diff_days_15_90_days: dataReinstallShopByTime.data?.average_diff_days_15_90_days,
      re_average_diff_days_1_14_days: dataReinstallShopByTime.data?.average_diff_days_1_14_days,
      re_average_diff_days_same_day: dataReinstallShopByTime.data?.average_diff_days_same_day,
    };
    if (!compare_app_id) {
      var dataGa = [];
      dataGa = gaData.data;
      var dataChartDetail = [];
      if (dataEarning && dataEarning.code === 0) {
        setDataByDate(resultChart);
        dataChartDetail = resultChart;
        setDataCustomLifecycle({
          dataGa: dataGa,
          data: dataChartDetail,
        });
      } else {
        setDataCustomLifecycle({
          dataGa: dataGa,
        });
        setDataByDate([]);
      }

      let count = 0;
      setRetentionData(dataRetension.data);
      keywordPositionByLanguage.dataKey.data.result.map((item) => {
        if (!item.show) {
          count++;
        }
      });
      setCountKeyword(count);
    }
    const dataFetchTab = {
      gaData: isLogged ? gaData.data : [],
      keywordPosition: isLogged ? keywordPositionByLanguage.dataKey.data.result : [],
      keywordPositionChange: isLogged
        ? {
            best_match: keywordPositionByLanguage.dataKeyChangeBestMatch,
            popular: keywordPositionByLanguage.dataKeyChangeMostPopular,
          }
        : [],
      ...resultChart,
    };
    return dataFetchTab;
  };

  const fetchInfoApp = (id, fromDate, toDate) => {
    Promise.all([getAppInfo(id, fromDate, toDate), isLogged && getAppInfoLogged(id, fromDate, toDate)]).then(
      (result) => {
        if (result) {
          const dataTabNew = [
            {
              id: result[0].appInfo?.data.app_id,
              value: mergedObject(result),
            },
          ];
          setDataAllTab(dataTabNew);
        }
      },
    );
  };

  const onChangeDateRange = (dates, dateStrings) => {
    if (dateStrings) {
      setFromDate(dateStrings[0]);
      setToDate(dateStrings[1]);
    }
  };

  const disabledFutureDate = (current) => {
    return current && current > dayjs().startOf('day');
  };

  const searchByDate = () => {
    fetchInfoApp(id, fromDate, toDate);
    setSelectedValue('D');
  };

  const fetchNewTab = async (activeKey) => {
    setloadingAppInfo(true);
    const index = competitor.findIndex((item) => +item.key === +activeKey);
    const dataTab = competitor[index];
    setId(dataTab.appId);
    const indexTab = dataAllTab.findIndex((item) => {
      return item.id === dataTab.appId;
    });
    setLanguage('uk');
    const resultTab = {};
    if (indexTab !== -1) {
      Object.assign(resultTab, dataAllTab[indexTab].value);
    } else {
      await Promise.all([
        getAppInfo(dataTab.appId, fromDate, toDate, true),
        isLogged && getAppInfoLogged(competitor[0].appId, fromDate, toDate, dataTab.appId),
      ]).then((result) => {
        if (result) {
          const dataTabNew = {
            id: dataTab.appId,
            value: mergedObject(result),
          };
          const resultTabNew = [...dataAllTab];
          resultTabNew.push(dataTabNew);
          setDataAllTab(resultTabNew);
          Object.assign(resultTab, mergedObject(result));
        }
      });
    }
    var dataGa = [];
    if (resultTab && Object.keys(resultTab).length !== 0) {
      setKeywordPosition(resultTab.keywordPosition);
      setDataKeywordsChange({
        bestMatch: resultTab.keywordPositionChange.best_match.data,
        popular: resultTab.keywordPositionChange.popular.data,
      });
      setFromDate(resultTab.appInfo.start_date);
      setToDate(resultTab.appInfo.end_date);
      setIsFollow(resultTab.appInfo.is_follow);
      setInfoApp({
        isBuilt4Shopify: resultTab.appInfo.data.detail.built_for_shopify,
        data: resultTab.appInfo.data,
        isOwner: resultTab.appInfo.is_owner,
        gaConnected: resultTab.appInfo.ga_connected,
        partnerConnected: resultTab.appInfo.shopify_connected,
        canAddGId: resultTab.appInfo.must_add_shopify_app_id,
      });
      setDataDetailApp({
        dataCategoryPos: resultTab.dataCategoryPos,
        ratingChange: resultTab.ratingChange,
        reviewsChange: resultTab.reviewsChange,
        changeLog: resultTab.changeLog,
      });
      setDataCatCollection({
        dataCategory: resultTab.dataCategory,
        dataCollection: resultTab.dataCollection,
      });
      dataGa = resultTab.gaData;
      let count = 0;
      resultTab.keywordPosition.map((item) => {
        if (!item.show) {
          count++;
        }
      });
      setCountKeyword(count);
      setDataKeywordsShow(dataKeywords(resultTab.keywordPosition));
      setloadingAppInfo(false);
    }

    var dataChartDetail = [];
    const {
      earning_by_date,
      install_by_date,
      merchant_by_date,
      total_earning,
      uninstall_by_date,
      total_earning_before,
      uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days,
      uninstalled_shop_91_days,
      uninstalled_shop_the_same_day,
      average_diff_days_1_14_days,
      average_diff_days_15_90_days,
      average_diff_days_same_day,
      dataRetension,
    } = resultTab;
    const resultChart = {
      earning_by_date,
      install_by_date,
      merchant_by_date,
      total_earning,
      uninstall_by_date,
      total_earning_before,
      uninstalled_shop_1_14_days,
      uninstalled_shop_15_90_days,
      uninstalled_shop_91_days,
      uninstalled_shop_the_same_day,
      average_diff_days_1_14_days,
      average_diff_days_15_90_days,
      average_diff_days_same_day,
      dataRetension,
    };
    if (resultChart) {
      setDataByDate(resultChart);
      dataChartDetail = resultChart;
    } else {
      setDataByDate([]);
    }
    setRetentionData(resultTab.dataRetension);
    setDataCustomLifecycle({
      dataGa: dataGa,
      data: dataChartDetail,
    });
  };

  const onChangeTab = (activeKey) => {
    setActiveState(activeKey);
    fetchNewTab(activeKey);
  };

  const fetchDataSyncPartner = () => {
    fetchInfoApp(id, fromDate, toDate);
  };

  const props = {
    idDetail,
    loadingAppInfo,
    setloadingAppInfo,
    infoApp,
    setInfoApp,
    isFollow,
    setIsFollow,
    fromDate,
    toDate,
    activeState,
    setActiveState,
    competitor,
    setCompetitor,
    dataDetailApp,
    loadingCatCollection,
    dataCatCollection,
    loading,
    dataByDate,
    dataCustomLifecycle,
    retentionData,
    countKeyword,
    setCountKeyword,
    dataKeywordsChange,
    keywordPosition,
    setKeywordPosition,
    dataKeywordsShow,
    setDataKeywordsShow,
    loadingChangeLanguage,
    setloadingChangeLanguage,
    id,
    isLogged,
    AppName,
    selectedValue,
    setSelectedValue,
    onChangeTab,
    fetchDataSyncPartner,
    onChangeDateRange,
    disabledFutureDate,
    searchByDate,
    language,
    setLanguage,
    asyncKeywordByLanguage,
  };

  return (
    <>
      {isCheck &&
        (isAuth ? (
          <ProductApp {...props} />
        ) : (
          <LayoutDetailApp>
            <ProductPage {...props} />
          </LayoutDetailApp>
        ))}
    </>
  );
}
