'use client';

import React, { useEffect, useRef, useState } from 'react';
import Auth from '@/utils/store/Authentication';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { convetDataChartChangeLog, createData, renderButtonAddkey, renderTabTitle } from '@/utils/functions';
import { Breadcrumb, Button, DatePicker, Form, Modal, Tabs, Tooltip, message } from 'antd';
import { useRouter } from 'next/navigation';
import {
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined,
  SettingOutlined,
  SwapOutlined,
  ExclamationCircleFilled,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import InfoApp from '@/components/info-app/InfoApp';
import { useDispatch } from 'react-redux';
import CategoryCollectionPos from '@/components/category-collection-pos/CategoryCollectionPos';
import dayjs from 'dayjs';
import SelectByLanguage from '@/components/ui/select-language/SelectByLanguage';
import TableKeyword from '@/components/table-keyword/TableKeyword';
import SelectCartHeader from '@/components/select-cart-header/SelectCartHeader';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isBetween from 'dayjs/plugin/isBetween';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { LayoutPaths, Paths } from '@/router';
import { getListMyApps } from '@/redux/slice/my-apps/MyApps';

const ChartMerchantEarnings = dynamic(
  () => import('@/components/chart/chart-merchant-earnings/ChartMerchantEarnings'),
  { ssr: false },
);
const EarningByPlan = dynamic(() => import('@/components/chart/earning-by-plan/EarningByPlan'), { ssr: false });
const ChartInstallUnInstall = dynamic(
  () => import('@/components/chart/chart-install-unInstall/ChartInstallUnInstall'),
  { ssr: false },
);
const Retention = dynamic(() => import('@/components/chart/retention/Retention'), {
  ssr: false,
});
const CustomerLifecycle = dynamic(() => import('@/components/chart/customer-lifecycle/CustomerLifecycle'), {
  ssr: false,
});
const ChartCategory = dynamic(() => import('@/components/chart/chart-category/ChartCategory'), {
  ssr: false,
});
const ChartWeeklyKeyword = dynamic(() => import('@/components/chart/chart-weekly-keyword/ChartWeeklyKeyword'), {
  ssr: false,
});
const ChartWeeklyRating = dynamic(() => import('@/components/chart/chart-weekly-rating/ChartWeeklyRating'), {
  ssr: false,
});
const ChartChangeLog = dynamic(() => import('@/components/chart/chart-change-log/ChartChangeLog'), {
  ssr: false,
});
const DataGA = dynamic(() => import('@/components/data-ga/DataGA'), {
  ssr: false,
});
const ChurnAndReinstall = dynamic(() => import('@/components/chart/churn-and-reinstall/ChurnAndReinstall'), {
  ssr: false,
});
const ModalAddKeyword = dynamic(() => import('@/components/modal-add-keyword/ModalAddKeyword'), {
  ssr: false,
});
const ModalSettingCompare = dynamic(() => import('@/components/modal-setting-compare/ModalSettingCompare'), {
  ssr: false,
});
const ModalEditListingApp = dynamic(() => import('@/components/modal-edit-listing-app/ModalEditListingApp'), {
  ssr: false,
});
const ModalPositionKeyword = dynamic(() => import('@/components/modal-position-keyword/ModalPositionKeyword'), {
  ssr: false,
});
const ModalCompetitor = dynamic(() => import('@/components/modal-competitor/ModalCompetitor'), {
  ssr: false,
});
const ModalKeywordHidden = dynamic(() => import('@/components/modal-keyword-hidden/ModalKeywordHidden'), {
  ssr: false,
});
const ModalOverallCompare = dynamic(() => import('@/components/modal-overall-compare/ModalOverallCompare'), {
  ssr: false,
});
const ModalAddPartner = dynamic(() => import('@/components/modal-add-partner/ModalAddPartner'), {
  ssr: false,
});
const ModalCompareList = dynamic(() => import('@/components/modal-compare-list/ModalCompareList'), {
  ssr: false,
});

dayjs.extend(isoWeek);
dayjs.extend(weekOfYear);
dayjs.extend(isBetween);

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';
const { confirm } = Modal;

export default function ProductApp(props) {
  const {
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
  } = props;

  const [form] = Form.useForm();
  const router = useRouter();
  const dataSortedKeyword = useRef();
  const [isMobile, setIsMoblie] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const keywordName = useRef('');
  const keywordNamePopular = useRef('');
  const [dataByDateSelected, setDataByDateSelected] = useState([]);
  const [loadingFollow, setloadingFollow] = useState(false);
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMoblie(window.innerWidth <= 1275);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const saveKeyword = async (values) => {
    const result = await DetailAppApiService.createKeyword(values.keyName, id);
    if (result.code === 0) {
      form.resetFields();
      setLanguage('uk');
      asyncKeywordByLanguage(id, 'uk', fromDate, toDate);
      setModalShow();
      message.success(result.message);
    } else {
      message.error('Add keyword error');
    }
  };

  const dataTabNew = (item) => {
    const activeKey = (competitor && competitor.length ? +competitor[competitor.length - 1].key : 0) + 1;
    setCompetitor((prev) => [
      ...prev,
      {
        appId: item.app_id,
        title: {
          ...item,
          changed: {},
        },
        content: <></>,
        changed: item.changed,
        name: item.name || '',
        isFollow: {
          appId: item.app_id,
          isFollow: item.is_follow,
        },
        key: activeKey,
      },
    ]);
  };

  const addKeywordHidden = async (keyword) => {
    const result = await DetailAppApiService.createKeyword([keyword.keyword], id);
    if (result.code === 0) {
      setLanguage('uk');
      asyncKeywordByLanguage(id, 'uk', fromDate, toDate);
      setCountKeyword((prev) => prev - 1);
      message.success('Add keyword success');
    } else {
      message.error('Add keyword error');
    }
  };

  const handleFollowApp = async (id, isFollow) => {
    setloadingFollow(true);
    const result = await DetailAppApiService.handleFollowApp(id, !isFollow);
    if (result && result.code == 0) {
      message.success(isFollow ? 'Unfollow app successfully!' : 'Follow app successfully!');
      setIsFollow(!isFollow);
      setloadingFollow(false);
    } else {
      message.error('Follow app failed!');
    }
  };

  const operations = (isFollow) => {
    const isConnectedGA = infoApp.gaConnected === true;
    const competitorLength = competitor.length > 1;

    const sortAppId = competitor.map((app) => app.appId).sort((a, b) => a.localeCompare(b));
    const sortedCompareApps = sortAppId.slice(1).join('-lmtvs-');
    const compareUrl = `/app/${sortAppId[0]}/compare-app/vs/${sortedCompareApps}`;

    const renderCompareButton = (url) => (
      <Link prefetch={false} href={url} target="_blank">
        <Button type="primary" className="button-compare" icon={<SwapOutlined />}>
          Compare
        </Button>
      </Link>
    );

    const renderSettingButton = () => (
      <Tooltip title="Setting">
        <Button
          onClick={() => setModalShow('isOpenSetting')}
          className="icon-button"
          shape="circle"
          icon={<SettingOutlined />}
        />
      </Tooltip>
    );

    const renderFollowButton = () => (
      <Button
        className={isFollow ? 'button-follow' : 'button-unfollow'}
        onClick={() => handleFollowApp(id, isFollow)}
        icon={<StarOutlined />}
        loading={loadingFollow}
        type={isFollow ? 'primary' : 'default'}
      >
        {isFollow ? 'Unfollow' : 'Follow'}
      </Button>
    );

    const renderCompareButtonShowModal = () => {
      return (
        <Button type="primary" className="button-compare" onClick={showModal} icon={<SwapOutlined />}>
          Compare
        </Button>
      );
    };

    return (
      <>
        {competitor && competitorLength && activeState == 1 && isConnectedGA ? (
          <>
            {renderSettingButton()}
            {renderCompareButton(compareUrl)}
          </>
        ) : competitor && competitor.length === 1 && activeState == 1 && isConnectedGA ? (
          <>
            {renderSettingButton()}
            {renderCompareButtonShowModal()}
          </>
        ) : !isConnectedGA && competitor && competitorLength && activeState ? (
          <>{renderCompareButton(compareUrl)}</>
        ) : isConnectedGA && competitor && competitorLength && activeState ? (
          <>{renderCompareButton(compareUrl)}</>
        ) : !isConnectedGA ? (
          <>{renderCompareButtonShowModal()}</>
        ) : null}
        {activeState == 1 && renderFollowButton()}
      </>
    );
  };

  const removeTab = async (key) => {
    const index = competitor.findIndex((item) => +item.key === +key);
    const dataTab = competitor[index];
    const result = await DetailAppApiService.deleteCompetitor(idDetail, dataTab.appId);
    if (result && result.code === 0) {
      setCompetitor((prev) => {
        const idx = prev.findIndex((item) => +item.key === +key);
        prev.splice(idx, 1);
        return [...prev];
      });
      if (activeState === key) {
        setActiveState(competitor[0].key);
        fetchNewTab(competitor[0].key);
      } else {
      }
      message.info('Delete comeptitor success!');
    }
  };

  const onEditTab = (targetKey, action) => {
    if (action === 'remove') {
      confirm({
        title: 'Are you sure you want to delete this tab?',
        icon: <ExclamationCircleFilled />,
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        async onOk() {
          try {
            removeTab(targetKey);
          } catch (error) {
            message.error("Competitor's deletion failed!");
          }
        },
        okButtonProps: {
          className: 'custom-ok-button',
        },
        cancelButtonProps: {
          className: 'custom-cancel-button',
        },
      });
    }
  };

  const trackingApp = async () => {
    const result = await DetailAppApiService.handleTrackingApp(id, !infoApp.isOwner);
    if (result && result.code == 0) {
      setInfoApp((prev) => {
        return { ...prev, isOwner: !infoApp.isOwner };
      });
      dispatch(getListMyApps());
      message.success(`${infoApp.isOwner ? 'Remove from your list apps' : 'Added app'} successfully!`);
    } else {
      message.error('Follow app failed!');
    }
  };

  const syncGoogleAnalytic = async () => {
    const result = await DetailAppApiService.gaLogin(id);
    if (result && result.code == 0) {
      window.location.href = result.authorization_url;
    }
  };

  const reloadKeyword = () => async () => {
    const result = await DetailAppApiService.reloadKeyword(id);
    if (result.code === 0) {
      message.success('Reload keyword success');
    } else {
      message.error('Reload keyword error');
    }
  };

  const onConfirm = () => {
    setModalShow('isEditKeyword');
    trackingApp();
  };

  const saveOrder = async () => {
    if (dataSortedKeyword.current) {
      const listKeword = [];
      dataSortedKeyword.current.map((item) => {
        listKeword.push(item.keyword.keyword);
      });
      if (listKeword.length > 0) {
        const result = await DetailAppApiService.saveKeywordPriority(id, listKeword);
        if (result && result.code === 0) {
          setLanguage('uk');
          message.success('Keyword position swap saved in section successfully');
          setDataKeywordsShow(dataSortedKeyword.current);
        } else {
          message.error('Error trying to save priority');
        }
      }
    }
  };

  const handleSelectChange = (value) => {
    setLanguage(value);
    setloadingChangeLanguage(true);
    asyncKeywordByLanguage(id, value, fromDate, toDate);
  };

  const getDataEarningAndMerchantApp = async (id, fromDate, toDate, selectedValue) => {
    const [dataEarning, dataMerchant] = await Promise.all([
      DetailAppApiService.getEarning(id, fromDate, toDate),
      DetailAppApiService.getMerchantApp(id, fromDate, toDate),
    ]);
    const resultChart = {
      earning_by_date: dataEarning.data?.earning_by_date,
      merchant_by_date: dataMerchant.data,
      total_earning: dataEarning.data?.total_earning,
      total_earning_before: dataEarning.data?.total_earning_before,
    };
    if (dataEarning && dataEarning.code === 0) {
      if (selectedValue === 'W') {
        let weeklyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const week = dayjs(item.date).format('YYYY-[W]WW');
          const existingWeekIndex = weeklyMerchant.findIndex((entry) => entry.date === week);
          if (existingWeekIndex !== -1) {
            weeklyMerchant[existingWeekIndex].merchant = item.merchant;
          } else {
            weeklyMerchant.push({ date: week, merchant: item.merchant });
          }
        });

        let weeklyEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const weekEarning = dayjs(item.date).format('YYYY-[W]WW');
          const existingWeekIndex = weeklyEarning.findIndex((entry) => entry.date === weekEarning);
          if (existingWeekIndex !== -1) {
            weeklyEarning[existingWeekIndex].active_charge += item.active_charge;
            weeklyEarning[existingWeekIndex].amount += item.amount;
            weeklyEarning[existingWeekIndex].cancel_charge += item.cancel_charge;
            weeklyEarning[existingWeekIndex].frozen_charge += item.frozen_charge;
            weeklyEarning[existingWeekIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            weeklyEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: weekEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = weeklyMerchant;
        resultChart.earning_by_date = weeklyEarning;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'M') {
        let monthlyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const month = dayjs(item.date).format('YYYY/MM');
          const existingMonthIndex = monthlyMerchant.findIndex((entry) => entry.date === month);
          if (existingMonthIndex !== -1) {
            monthlyMerchant[existingMonthIndex].merchant = item.merchant;
          } else {
            monthlyMerchant.push({ date: month, merchant: item.merchant });
          }
        });
        let monthlyEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const monthEarning = dayjs(item.date).format('YYYY/MM');
          const existingMonthIndex = monthlyEarning.findIndex((entry) => entry.date === monthEarning);
          if (existingMonthIndex !== -1) {
            monthlyEarning[existingMonthIndex].active_charge += item.active_charge;
            monthlyEarning[existingMonthIndex].amount += item.amount;
            monthlyEarning[existingMonthIndex].cancel_charge += item.cancel_charge;
            monthlyEarning[existingMonthIndex].frozen_charge += item.frozen_charge;
            monthlyEarning[existingMonthIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            monthlyEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: monthEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = monthlyMerchant;
        resultChart.earning_by_date = monthlyEarning;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'Q') {
        const merchantByQuarter = [];
        const earningByQuarter = [];
        for (let i = 0; i < 8; i++) {
          const startQuarter = dayjs(toDate)
            .subtract((i + 1) * 3, 'months')
            .startOf('quarter');
          const endQuarter = dayjs(toDate)
            .subtract(i * 3, 'months')
            .startOf('quarter');

          const quarterStartDate = startQuarter.format('YYYY-MM');
          const quarterEndDate = endQuarter.format('YYYY-MM');

          const merchantInQuarter = resultChart.merchant_by_date.filter((item) =>
            dayjs(item.date).isBetween(startQuarter, endQuarter, null, '[]'),
          );
          const merchant = merchantInQuarter.map((item) => item.merchant);
          merchantByQuarter.push({
            date: `${quarterStartDate}-${quarterEndDate}`,
            merchant: merchant.pop(),
          });

          const earningInQuarter = resultChart.earning_by_date.filter((item) =>
            dayjs(item.date).isBetween(startQuarter, endQuarter, null, '[]'),
          );
          const totalActiveCharge = earningInQuarter.reduce((total, item) => total + item.active_charge, 0);
          const totalAmount = earningInQuarter.reduce((total, item) => total + item.amount, 0);
          const totalCancelCharge = earningInQuarter.reduce((total, item) => total + item.cancel_charge, 0);
          const totalFrozenCharge = earningInQuarter.reduce((total, item) => total + item.frozen_charge, 0);
          const totalUnfrozenCharge = earningInQuarter.reduce((total, item) => total + item.unfrozen_charge, 0);
          const dateEarning = `${quarterStartDate}-${quarterEndDate}`;
          earningByQuarter.push({
            active_charge: totalActiveCharge,
            amount: totalAmount,
            cancel_charge: totalCancelCharge,
            date: dateEarning,
            frozen_charge: totalFrozenCharge,
            unfrozen_charge: totalUnfrozenCharge,
          });
        }

        resultChart.merchant_by_date = merchantByQuarter.reverse();
        resultChart.earning_by_date = earningByQuarter;
        setDataByDateSelected(resultChart);
      }

      if (selectedValue === 'Y') {
        let yearlyMerchant = [];
        resultChart.merchant_by_date.forEach((item) => {
          const month = dayjs(item.date).format('YYYY');
          const existingMonthIndex = yearlyMerchant.findIndex((entry) => entry.date === month);
          if (existingMonthIndex !== -1) {
            yearlyMerchant[existingMonthIndex].merchant = item.merchant;
          } else {
            yearlyMerchant.push({ date: month, merchant: item.merchant });
          }
        });
        let yearEarning = [];
        resultChart.earning_by_date.forEach((item) => {
          const monthEarning = dayjs(item.date).format('YYYY');
          const existingMonthIndex = yearEarning.findIndex((entry) => entry.date === monthEarning);
          if (existingMonthIndex !== -1) {
            yearEarning[existingMonthIndex].active_charge += item.active_charge;
            yearEarning[existingMonthIndex].amount += item.amount;
            yearEarning[existingMonthIndex].cancel_charge += item.cancel_charge;
            yearEarning[existingMonthIndex].frozen_charge += item.frozen_charge;
            yearEarning[existingMonthIndex].unfrozen_charge += item.unfrozen_charge;
          } else {
            yearEarning.push({
              active_charge: item.active_charge,
              amount: item.amount,
              cancel_charge: item.cancel_charge,
              date: monthEarning,
              frozen_charge: item.frozen_charge,
              unfrozen_charge: item.unfrozen_charge,
            });
          }
        });

        resultChart.merchant_by_date = yearlyMerchant;
        resultChart.earning_by_date = yearEarning;

        setDataByDateSelected(resultChart);
      }

      setDataByDateSelected(resultChart);
    } else {
      setDataByDateSelected([]);
    }
    return resultChart;
  };

  const filterData = async (selected, id, fromDate, toDate) => {
    setloadingAppInfo(true);
    let filtered = [];
    try {
      switch (selected) {
        case 'D':
          filtered = await getDataEarningAndMerchantApp(id, fromDate, toDate);
          break;
        case 'W':
          let fromDateWeek = dayjs(toDate).subtract(21, 'weeks').startOf('week').format('YYYY-MM-DD');
          const dataFor21Weeks = await getDataEarningAndMerchantApp(id, fromDateWeek, toDate, selected);
          filtered = dataFor21Weeks;
          break;
        case 'M':
          const fromDateYearAgo = dayjs(toDate).subtract(11, 'months').startOf('month').format('YYYY-MM-DD');
          const toDateCurrentMonth = dayjs(toDate).endOf('month').format('YYYY-MM-DD');
          const dataFor12Months = await getDataEarningAndMerchantApp(id, fromDateYearAgo, toDateCurrentMonth, selected);
          filtered = dataFor12Months;
          break;
        case 'Q':
          const quartersData = [];
          const quarter = 8;
          const fromDateQuarter = dayjs(toDate)
            .subtract(quarter * 3, 'months')
            .startOf('quarter')
            .format('YYYY-MM-DD');
          const toDateQuarter = dayjs(toDate).format('YYYY-MM-DD');
          const dataForQuarter = await getDataEarningAndMerchantApp(id, fromDateQuarter, toDateQuarter, selected);
          quartersData.push(dataForQuarter);
          filtered = quartersData;
          break;
        case 'Y':
          const yearsData = [];
          const year = 5;
          const fromDateYear = dayjs(toDate).subtract(year, 'years').startOf('year').format('YYYY-MM-DD');
          const toDateYear = dayjs(toDate).format('YYYY-MM-DD');
          const dataForYear = await getDataEarningAndMerchantApp(id, fromDateYear, toDateYear, selected);
          yearsData.push(dataForYear);
          filtered = yearsData;
          break;
        default:
          break;
      }
      setSelectedValue(selected);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setloadingAppInfo(false);
    }
    return filtered;
  };

  const handleSelectFilter = (value) => {
    filterData(value, id, fromDate, toDate);
  };

  const openDetailPosition = (item) => () => {
    keywordName.current = item.keyword;
    setModalShow('isPositionKeyword');
  };

  const openDetailPositionPopular = (item) => () => {
    keywordNamePopular.current = item.keyword;
    setModalShow('isPositionPopularKeyword');
  };

  const changeShowbadge = async (item) => {
    const result = await DetailAppApiService.changeKeywordInChart(id, item.keyword, !item.show_in_chart);
    if (result && result.code == 0) {
      item.show_in_chart = !item.show_in_chart;
      let dataNew = [...keywordPosition];
      const index = keywordPosition.findIndex((i) => i.keyword === item.keyword);
      dataNew[index] = item;
      setKeywordPosition(dataNew);
    }
  };

  const removeKeyword = (item) => async () => {
    if (item) {
      setloadingChangeLanguage(true);
      const result = await DetailAppApiService.deleteKeyword(item.keyword, id);
      if (result.code === 0) {
        asyncKeywordByLanguage(id, language, fromDate, toDate);
        message.success('Delete keyword success');
      } else {
        message.error('Delete keyword error');
      }
      setloadingChangeLanguage(false);
    }
  };

  const onChangeSort = (pagination, filters, sorter, extra) => {
    dataSortedKeyword.current = extra.currentDataSource;
  };

  return (
    <div className="detail-app">
      {/*Start Modal */}
      <div className="popup-detail-add-partner">
        {modalShow === 'isVisibleAddPartner' && (
          <ModalAddPartner appId={id} disableModal={() => setModalShow()} fetchDataSyncPartner={fetchDataSyncPartner} />
        )}
      </div>
      <div className="popup-detail-position-key">
        {modalShow === 'isPositionKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordName.current}
            language={language}
          />
        )}
      </div>
      <div className="popup-detail-position-popular-key">
        {modalShow === 'isPositionPopularKeyword' && (
          <ModalPositionKeyword
            appId={id}
            disableModal={() => setModalShow()}
            fromDate={fromDate}
            toDate={toDate}
            keywordName={keywordNamePopular.current}
            language={language}
            isPopular
          />
        )}
      </div>
      <div className="popup-add-competitor">
        {modalShow === 'isVisibleCompetitor' && (
          <ModalCompetitor
            appId={id}
            disableModal={() => setModalShow()}
            dataTabNew={dataTabNew}
            competitor={competitor}
            infoApp={infoApp}
          />
        )}
      </div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleKeywordHidden' && (
          <ModalKeywordHidden
            appId={id}
            disableModal={() => setModalShow()}
            keywordPosition={keywordPosition}
            addKeywordHidden={addKeywordHidden}
          />
        )}
      </div>
      <div>{modalShow === 'isVisibleCompare' && <ModalOverallCompare handleOk={() => setModalShow()} id={id} />}</div>
      <div className="popup-keyword-hidden">
        {modalShow === 'isVisibleEditApp' && (
          <ModalEditListingApp
            appId={id}
            disableModal={() => setModalShow()}
            data={{
              app_id: infoApp.data.app_id,
              detail: infoApp.data.detail,
              keyword_pos: keywordPosition,
            }}
          />
        )}
      </div>
      <div>
        {modalShow === 'isOpenSetting' && (
          <ModalSettingCompare
            setIsOpenSetting={setModalShow}
            compareApps={competitor}
            setCompetitor={setCompetitor}
            addCompetitor={() => setModalShow('isVisibleCompetitor')}
          />
        )}
      </div>
      <div className="popup-change-keyword">
        {modalShow === 'isEditKeyword' && (
          <ModalAddKeyword
            saveKeyword={saveKeyword}
            handleEditOk={() => setModalShow()}
            keywordExist={dataKeywordsShow}
            id={id}
          />
        )}
      </div>
      <div className="popup-compare-apps">
        <ModalCompareList
          visible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          appId={id}
          infoApp={infoApp?.data || {}}
        />
      </div>
      {/*End Modal */}

      <>
        <div className="detail-developers-header">
          <div className="container">
            <Breadcrumb>
              <Breadcrumb.Item className="link">
                <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
                App
              </Breadcrumb.Item>
              <Breadcrumb.Item className="link">{AppName.current || ''}</Breadcrumb.Item>
            </Breadcrumb>
          </div>
        </div>

        <div className="competitor">
          <div className={isMobile ? 'p-20' : 'container'}>
            <Tabs
              type={
                (activeState != 1 && isLogged) || (infoApp && infoApp.gaConnected && activeState == 1)
                  ? 'editable-card'
                  : 'card'
              }
              tabBarExtraContent={!loadingAppInfo && isLogged && operations(isFollow)}
              addIcon={
                (activeState != 1 && isLogged) || (infoApp && infoApp.gaConnected && activeState == 1) ? (
                  <div className="add-competitor">
                    <Button
                      type="dashed"
                      icon={<PlusOutlined />}
                      size="large"
                      onClick={() => setModalShow('isVisibleCompetitor')}
                    >
                      Add competitor
                    </Button>
                  </div>
                ) : (
                  <></>
                )
              }
              onChange={onChangeTab}
              activeKey={activeState}
              onEdit={onEditTab}
            >
              {competitor &&
                competitor.map((pane) => (
                  <TabPane
                    disabled={loading}
                    tab={renderTabTitle(pane.title, pane.key, activeState)}
                    key={pane.key}
                    closable={pane.closable}
                  >
                    {pane.content}
                  </TabPane>
                ))}
            </Tabs>
          </div>
        </div>

        <div className={isMobile ? 'p-20' : 'container'}>
          <div className="header-detail-app-info">
            <div className="header-detail-app-info-left">
              <div>
                <InfoApp
                  id={id}
                  editListingApp={() => setModalShow('isVisibleEditApp')}
                  editPartnerAppId={() => setModalShow('isVisibleAddPartner')}
                  AppName={AppName}
                  infoApp={infoApp}
                  loadingAppInfo={loadingAppInfo}
                  setInfoApp={setInfoApp}
                  fetchDataSyncPartner={fetchDataSyncPartner}
                  trackingApp={trackingApp}
                />
              </div>
            </div>
            <CategoryCollectionPos
              isUnlist={infoApp?.data?.delete || infoApp?.data?.unlisted}
              loading={loadingCatCollection}
              dataCategory={dataCatCollection && dataCatCollection.dataCategory}
              dataCollection={dataCatCollection && dataCatCollection.dataCollection}
              infoApp={infoApp}
            />
          </div>
        </div>

        <div className="selected-date_range container">
          {fromDate && toDate && (
            <div className="date-range">
              <span className="title-name">Date Range: </span>
              <div className="date-picker">
                <RangePicker
                  defaultValue={[dayjs(fromDate, dateFormat), dayjs(toDate, dateFormat)]}
                  format={dateFormat}
                  allowClear={false}
                  onChange={onChangeDateRange}
                  disabledDate={disabledFutureDate}
                  style={{ marginRight: '10px' }}
                />

                <Button
                  type="primary"
                  loading={loadingAppInfo}
                  icon={<SearchOutlined />}
                  className="icon-search-date"
                  onClick={searchByDate}
                >
                  Search
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="body-detail-app">
          <div className={isMobile ? 'p-20' : 'container'}>
            {Auth.getAccessToken() ? (
              <>
                <div className="table-keyword-position">
                  <div className="header-table">
                    <div className="button-add">
                      {activeState && infoApp && activeState == 1 ? (
                        <div className="left">
                          {!infoApp.gaConnected && (
                            <span style={{ marginRight: '10px' }}>
                              <Link prefetch={false} href={''} onClick={syncGoogleAnalytic}>
                                Connect GA
                              </Link>{' '}
                              to show values of all columns
                            </span>
                          )}
                          <span className="reload" onClick={reloadKeyword()}>
                            <ReloadOutlined />
                          </span>
                          {renderButtonAddkey(
                            infoApp.isOwner,
                            !infoApp.isOwner ? onConfirm : () => setModalShow('isEditKeyword'),
                          )}
                        </div>
                      ) : (
                        ''
                      )}

                      <div
                        className={`save-order ${dataKeywordsShow.length === 0 ? 'disabled' : ''}`}
                        onClick={dataKeywordsShow.length !== 0 ? saveOrder : null}
                      >
                        Save order
                      </div>

                      <div className="language">
                        <SelectByLanguage
                          selectValue={language}
                          handleSelectChange={handleSelectChange}
                          disabled={loadingChangeLanguage || dataKeywordsShow.length == 0}
                        />
                      </div>
                    </div>
                  </div>
                  <TableKeyword
                    openDetailPosition={openDetailPosition}
                    openDetailPositionPopular={openDetailPositionPopular}
                    changeShowbadge={changeShowbadge}
                    removeKeyword={removeKeyword}
                    dataKeywordsShow={dataKeywordsShow}
                    setDataKeywordsShow={setDataKeywordsShow}
                    onChangeSort={onChangeSort}
                    loading={loadingChangeLanguage || loading}
                    appId={id}
                    tabKey={activeState}
                    infoApp={infoApp}
                    countKeyword={countKeyword}
                    setModalShow={setModalShow}
                  />
                </div>
                {infoApp && infoApp.isOwner && infoApp.partnerConnected && (
                  <>
                    <div className="chart-merchant-growth-earnings">
                      <div className="filter-chart">
                        <SelectCartHeader
                          title={'Select filter by time period: '}
                          value={selectedValue}
                          onChange={handleSelectFilter}
                        />
                      </div>
                      <ChartMerchantEarnings
                        loading={loadingAppInfo}
                        value={dataByDate}
                        filterSelected={dataByDateSelected}
                        selectedValue={selectedValue}
                      />
                    </div>
                    {dataByDate && dataByDate.earning_by_pricing && dataByDate.earning_by_pricing.length >= 1 && (
                      <div>
                        <EarningByPlan value={dataByDate} />
                      </div>
                    )}

                    <div className="chart-retention">
                      <ChartInstallUnInstall loading={loadingAppInfo} value={dataByDate}></ChartInstallUnInstall>
                    </div>
                    <div className="churn-reinstall">
                      <ChurnAndReinstall
                        loading={loadingAppInfo}
                        value={dataByDate}
                        appId={id}
                        fromDate={fromDate}
                        toDate={toDate}
                      />
                    </div>
                    <div className="chart-install-uninstall">
                      <Retention fromDate={fromDate} toDate={toDate} retention={retentionData} id={id} />
                    </div>
                  </>
                )}
                <div className="customer-lifecycle">
                  {infoApp && infoApp.isOwner && (infoApp.gaConnected || infoApp.partnerConnected) ? (
                    <CustomerLifecycle value={dataCustomLifecycle} infoApp={infoApp} />
                  ) : (
                    ''
                  )}
                </div>
              </>
            ) : (
              <></>
            )}
            <div className="chart-weekly-category-keyword">
              <ChartCategory
                loading={loadingAppInfo}
                dataBestMatch={
                  dataDetailApp?.dataCategoryPos?.best_match
                    ? createData(dataDetailApp.dataCategoryPos.best_match)
                    : null
                }
                dataPopular={
                  dataDetailApp?.dataCategoryPos?.popular ? createData(dataDetailApp.dataCategoryPos.popular) : null
                }
              />
            </div>
            {Auth.getAccessToken() && (
              <>
                <div className="chart-weekly-category-keyword">
                  <div className="chart-weekly-keyword">
                    <ChartWeeklyKeyword
                      title={'Positional Keyword Changes'}
                      value={dataKeywordsChange && createData(dataKeywordsChange.bestMatch)}
                      loading={loadingAppInfo}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="chart-weekly-review-rating">
              <div className="chart-weekly-reviews">
                <ChartWeeklyRating
                  isReview
                  value={dataDetailApp && createData(dataDetailApp.reviewsChange)}
                  loading={loadingAppInfo}
                  infoApp={infoApp}
                />
              </div>
              <div className="chart-weekly-rating">
                <ChartWeeklyRating
                  value={dataDetailApp && createData(dataDetailApp.ratingChange)}
                  loading={loadingAppInfo}
                  infoApp={infoApp}
                />
              </div>
            </div>
            <div className="chart-weekly-change-trend">
              <div id="chart-log-weekly" className="chart-weekly-change">
                <ChartChangeLog
                  value={
                    dataDetailApp &&
                    convetDataChartChangeLog(dataDetailApp && dataDetailApp.changeLog ? dataDetailApp.changeLog : [])
                  }
                  loading={loadingAppInfo}
                  infoApp={infoApp}
                />
              </div>
            </div>
            <div className="data-from-ga">
              {Auth.getAccessToken() && infoApp && infoApp.isOwner && infoApp.gaConnected ? (
                <DataGA value={dataCustomLifecycle && dataCustomLifecycle.dataGa} appId={idDetail} />
              ) : (
                <>
                  Connect your Google Analytics
                  {!Auth.getAccessToken() && (
                    <>
                      {' '}
                      or
                      <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
                        {' '}
                        login
                      </Link>
                    </>
                  )}{' '}
                  to view the analyzed detail
                </>
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
