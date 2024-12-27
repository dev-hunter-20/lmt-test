'use client';

import './Retention.scss';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Tabs } from 'antd';
import ModalDetailRetension from './modal/ModalDetailRetension';
import { checkValueStyle } from '@/utils/functions';
import dayjs from 'dayjs';

function Retention(props) {
  const [type, setType] = useState('retention');
  const [dataRetention, setDataRetention] = useState([]);
  const [retentionList, setRetentionList] = useState([]);
  const [retentionListAll, setRetentionListAll] = useState([]);
  const [retentionListFree, setRetentionListFree] = useState([]);
  const [retentionListPaid, setRetentionListPaid] = useState([]);
  const [dateList, setDateList] = useState([]);
  const [columDate, setColumDate] = useState([]);
  const [dataAVG, setDataAVG] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [checkHasRetention, setCheckHasRetention] = useState(false);
  const [retentionType, setRetentionType] = useState('all');
  const [stageActive, setStageActive] = useState('0');
  const dateInstall = useRef('');
  const dateCheck = useRef('');

  const [dataCount, setDataCount] = useState({
    all: 0,
    free: 0,
    paid: 0,
  });

  useEffect(() => {
    let dataCount = {
      all: 0,
      free: 0,
      paid: 0,
    };
    if (typeof props.retention === 'object' && props.retention !== null) {
      if (Object.keys(props.retention).length > 0) {
        setCheckHasRetention(true);
        let allRetension = props.retention;
        let listDate = getAllDate(dayjs(props.fromDate).subtract(60, 'days'), props.toDate, 'YYYY-MM-DD');
        let listRetention = [];
        for (let i = 0; i < listDate.length; i++) {
          if (allRetension[listDate[i]] === undefined) {
            listRetention[i] = [];
          } else {
            listRetention[i] = allRetension[listDate[i]];
          }
        }
        const result = listRetention;
        setRetentionListAll(result);
        let newArrFree = [];
        let newArrPaid = [];
        for (let i = 0; i < result.length; i++) {
          newArrFree[i] = [];
          newArrPaid[i] = [];
          let shopData = result[i];
          for (let j = 0; j < shopData.length; j++) {
            dataCount.all += 1;
            if (shopData[j].type === 'free') {
              newArrFree[i].push(shopData[j]);
              dataCount.free += 1;
            }
            if (shopData[j].type === 'paid' || parseInt(shopData[j].paid) > 0) {
              newArrPaid[i].push(shopData[j]);
              dataCount.paid += 1;
            }
          }
        }
        setRetentionListFree(newArrFree);
        setRetentionListPaid(newArrPaid);
      }
    }
    setDataCount(dataCount);
  }, [props.retention, retentionType, props.fromDate, props.toDate]);

  useEffect(() => {
    if (retentionType === 'all') {
      setRetentionList(retentionListAll);
    } else if (retentionType === 'free') {
      setRetentionList(retentionListFree);
    } else if (retentionType === 'paid') {
      setRetentionList(retentionListPaid);
    }
  }, [retentionType, retentionListAll, retentionListFree, retentionListPaid]);

  const stageType = useMemo(() => {
    const { fromDate, toDate } = props;
    const dateLength = getAllDate(dayjs(fromDate).subtract(60, 'days'), toDate, 'MMM DD').length;
    const array = Array.from({ length: dateLength > 40 ? Math.floor(dateLength / 31 + 1) : dateLength }, (_, index) => {
      return { index, start: index * 30, end: 30 * index + 30 };
    });
    const lastArr = array[array.length - 1];
    lastArr.start = (array.length - 1) * 30;
    lastArr.end = dateLength - 1;

    return array;
  }, [props]);

  useEffect(() => {
    const { fromDate, toDate } = props;
    let dateList = getAllDate(dayjs(fromDate).subtract(60, 'days'), toDate, 'MMM DD');
    const stage = stageType.find((_, index) => index == stageActive);
    setDateList(dateList.slice(stage.start, stage.end + 1));
  }, [props, stageActive, stageType]);

  useEffect(() => {
    const { fromDate, toDate } = props;
    const dateRange = getAllDate(dayjs(fromDate).subtract(60, 'days'), toDate);
    const dateLength = dateRange.length;
    const stage = stageType.find((_, index) => index == stageActive);
    const dataDays = [];
    const dataAVG = [];
    const column = [];
    const averageData = [];
    let dateList = getAllDate(dayjs(fromDate).subtract(60, 'days'), toDate, 'MMM DD');
    for (let j = 0; j < dateLength + 1; j++) {
      dataDays[j] = [];
      dataAVG[j] = [];
      column[j] = [];
      averageData[j] = 0;
    }
    const result = retentionList;
    if (result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        let dataTest = processData([result[i]], type, result.length - i, 'record');
        dataDays[i + 1] = dataTest.listAVG;
        let shopData = result[i];
        let totalInstall = shopData.length;
        column[i + 1] = {
          title: dateList[i],
          users: totalInstall,
        };
      }
    }
    const dataAVGList = processData(retentionList, type, dateList.length, 'title');
    dataDays[0] = dataAVGList.listAVG;
    column[0] = {
      title: 'Avg (' + retentionList.length + ' days)',
      users: dataAVGList.totalUsers,
    };
    setDataAVG(dataAVGList);
    setColumDate(column);
    setDataRetention(dataDays.map((item) => item.slice(stage.start, stage.end + 1)).filter((ele) => ele.length !== 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.fromDate, props.toDate, props.retention, retentionList, type, stageType, stageActive]);

  const processData = (retentionList90, type, range, processType) => {
    let totalUsers = 0;
    let listUserUnistall = []; //day 1 - 29
    let listAVG = []; //day 1 - 29
    let dateInstallReturn = []; //day 1 - 29
    for (let i = 0; i < range; i++) {
      listUserUnistall[i] = 0;
      listAVG[i] = 0;
    }

    for (let i = 0; i < retentionList90.length; i++) {
      let shopData = retentionList90[i];
      if (shopData[0]) {
        dateInstallReturn = shopData[0].install_at.substring(0, 10);
      }
      for (let j = 0; j < shopData.length; j++) {
        totalUsers += 1;
        if (shopData[j].uninstall_at !== '' && shopData[j].uninstall_at >= shopData[j].install_at) {
          let installAt = new Date(shopData[j].install_at.substring(0, 10));
          let uninstallAt = new Date(shopData[j].uninstall_at.substring(0, 10));
          const oneDay = 24 * 60 * 60 * 1000;
          const diffDays = Math.floor(Math.abs((uninstallAt - installAt) / oneDay));
          if (diffDays <= range - 1) {
            listUserUnistall[diffDays] += 1;
          }
        }
      }
    }
    let countUninstall = 0;
    for (let i = 0; i < listUserUnistall.length; i++) {
      countUninstall += listUserUnistall[i];

      let devide = 100;
      if (totalUsers !== 0) {
        devide = ((totalUsers - countUninstall) / totalUsers) * 100;
        if (type === 'churn') {
          devide = (countUninstall / totalUsers) * 100;
        }
        listAVG[i] = {
          percent: Math.round(devide * 10) / 10,
          usersRetention: totalUsers - countUninstall,
          dateInstall: processType === 'title' ? 0 : dateInstallReturn,
        };
      } else {
        listAVG[i] = {
          percent: 0,
          usersRetention: 0,
          dateInstall: processType === 'title' ? 0 : dateInstallReturn,
        };
      }
    }
    return { listAVG: listAVG, totalUsers: totalUsers };
  };

  const onChangeTab = (value) => {
    setRetentionType(value);
  };

  const onChangeStage = (value) => {
    setStageActive(value);
  };

  const onChangeTabType = (value) => {
    setType(value);
  };

  const showListShop = (value, daySelected) => {
    if (value.dateInstall == 0) {
      return;
    }
    const installDate = value.dateInstall;
    dateInstall.current = installDate;
    const date = new Date(installDate);
    const dateCopy = new Date(date.getTime());
    dateCopy.setDate(dateCopy.getDate() + daySelected);
    let check = dayjs(dateCopy).format('YYYY-MM-DD');
    dateCheck.current = check;
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const showNumberMerchants = (totalMerchant, merchant, type) => {
    let text;
    if (type == 'retention') {
      merchant == 1 || merchant == 0 ? (text = ' merchant') : (text = ' merchants');
      return merchant + text;
    } else {
      totalMerchant - merchant == 1 || totalMerchant - merchant == 0 ? (text = ' merchant') : (text = ' merchants');
      return totalMerchant - merchant + text;
    }
  };

  const tabItemsType = [
    { label: 'Retention', key: 'retention' },
    { label: 'Churn', key: 'churn' },
  ];

  const tabItemsRetention = [
    { label: `All Merchants (${dataCount.all})`, key: 'all' },
    { label: `Free (${dataCount.free})`, key: 'free' },
    { label: `Paid (${dataCount.paid})`, key: 'paid' },
  ];

  const tabItemsStage = stageType.map((item) => ({
    label: `D${item.start} - D${item.end} (${
      dataAVG.listAVG && dataAVG.listAVG[item.end] ? dataAVG.listAVG[item.end]['percent'] : 0
    }%)`,
    key: item.index.toString(),
  }));

  return (
    <div className="row-retention">
      {checkHasRetention ? (
        <div>
          <Tabs onChange={onChangeTabType} type="card" activeKey={type} items={tabItemsType} />
          <div className="">
            <Tabs onChange={onChangeTab} activeKey={retentionType} items={tabItemsRetention} />
            <div className="">
              <Tabs onChange={onChangeStage} activeKey={stageActive} items={tabItemsStage} />
            </div>
            <div className="content-retention">
              <div className="content-retention-table">
                <div className="content-retention-table-content">
                  <div className="title"> </div>
                  {dateList.map((value, index) => {
                    if (index < dateList.length) {
                      return (
                        <div key={index + value} className="value">
                          D{stageActive * 30 + index}
                        </div>
                      );
                    }
                  })}
                </div>
                {dataRetention.map((item, index) => {
                  return (
                    <div key={index + item} className="content-retention-table-content">
                      <div className="title">
                        {columDate[index].title} <br /> <span>{columDate[index].users} merchants</span>
                      </div>
                      {item.map((value, index2) => {
                        return (
                          <div
                            key={index2 + value}
                            onClick={() => showListShop(value, stageActive * 30 + index2 + 1)}
                            title={showNumberMerchants(columDate[index].users, value.usersRetention, type)}
                            style={checkValueStyle(value, type)}
                            className="value"
                          >
                            {value.percent}%
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {showModal && (
        <ModalDetailRetension
          visible={showModal}
          closeModal={closeModal}
          dateInstall={dateInstall.current}
          dateCheck={dateCheck.current}
          id={props.id}
          type={retentionType}
        />
      )}
    </div>
  );
}

export default Retention;

function getAllDate(fromDate, toDate, format = 'YYYY-MM-DD') {
  var getDaysBetweenDates = function (fromDate, toDate) {
    var now = fromDate.clone(),
      dates = [];

    while (now.isBefore(toDate) || now.isSame(toDate, 'day')) {
      dates.push(now.format(format));
      now = now.add(1, 'day');
    }
    return dates;
  };

  let from = dayjs(fromDate);
  let to = dayjs(toDate);

  var dateList = getDaysBetweenDates(from, to);
  return dateList;
}
