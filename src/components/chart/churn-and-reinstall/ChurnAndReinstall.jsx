'use client';

import React, { useState } from 'react';
import './ChurnAndReinstall.scss';
import ModalChurnUninstall from './modal/churn-uninstall/ModalChurnUninstall';
import ModalReinstall from './modal/reinstall/ModalReinstall';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

export default function ChurnAndReinstall(props) {
  const {
    uninstalled_shop_the_same_day,
    uninstalled_shop_1_14_days,
    uninstalled_shop_15_90_days,
    uninstalled_shop_91_days,
    average_diff_days_1_14_days,
    average_diff_days_15_90_days,
    average_diff_days_same_day,
    reinstalled_shop_the_same_day,
    reinstalled_shop_1_14_days,
    reinstalled_shop_15_90_days,
    reinstalled_shop_91_days,
    re_average_diff_days_1_14_days,
    re_average_diff_days_15_90_days,
    re_average_diff_days_same_day,
  } = props.value;

  const [showModalChurn, setShowModalChurn] = useState(null);
  const [showModalReinstall, setShowModalReinstall] = useState(null);

  const checkAmount = (value) => {
    const amount = value ? value.toFixed(0) : 0;
    if (value > 1) {
      return `${amount} days`;
    }
    return `${amount} day`;
  };

  const renderTime = (seconds) => {
    const duration = dayjs.duration(seconds, 'seconds');
    const formattedTime = dayjs.utc(duration.asMilliseconds()).format('HH:mm:ss');
    return formattedTime;
  };

  const showChurnModal = (type) => {
    setShowModalChurn(type);
  };

  const showReinstallModal = (type) => {
    setShowModalReinstall(type);
  };

  return (
    <div className="row-churn-reinstall">
      <div className="title-churn-reinstall">
        <span>Churn And Reinstall</span>
      </div>
      <div className="content-churn-reinstall">
        <div className="table-churn-reinstall-value">
          <table className="styled-table">
            <thead>
              <tr>
                <th colSpan={1} rowSpan={2} className="thead-parent text-center">
                  Mertric
                </th>
                <th colSpan={2} className="thead-parent text-center">
                  Churn
                </th>
                <th colSpan={2} className="thead-parent text-center">
                  Reinstall
                </th>
              </tr>
              <tr>
                <th>Value</th>
                <th>Avg.Time</th>
                <th>Value</th>
                <th>Avg.Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Same day</td>
                <td
                  className={`text-value ${uninstalled_shop_the_same_day !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showChurnModal(1)}
                >
                  {uninstalled_shop_the_same_day !== 0 ? uninstalled_shop_the_same_day : ''}
                </td>
                <td>{renderTime(average_diff_days_same_day * 86400)}</td>
                <td
                  className={`text-value ${reinstalled_shop_the_same_day !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showReinstallModal(1)}
                >
                  {reinstalled_shop_the_same_day !== 0 ? reinstalled_shop_the_same_day : ''}
                </td>
                <td>{renderTime(re_average_diff_days_same_day * 86400)}</td>
              </tr>
              <tr>
                <td>1 - 14 days</td>
                <td
                  className={`text-value ${uninstalled_shop_1_14_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showChurnModal(2)}
                >
                  {uninstalled_shop_1_14_days !== 0 ? uninstalled_shop_1_14_days : ''}
                </td>
                <td>{checkAmount(average_diff_days_1_14_days)}</td>
                <td
                  className={`text-value ${reinstalled_shop_1_14_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showReinstallModal(2)}
                >
                  {reinstalled_shop_1_14_days !== 0 ? reinstalled_shop_1_14_days : ''}
                </td>
                <td>{checkAmount(re_average_diff_days_1_14_days)}</td>
              </tr>
              <tr>
                <td>15 - 90 days</td>
                <td
                  className={`text-value ${uninstalled_shop_15_90_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showChurnModal(3)}
                >
                  {uninstalled_shop_15_90_days !== 0 ? uninstalled_shop_15_90_days : ''}
                </td>
                <td>{checkAmount(average_diff_days_15_90_days)}</td>
                <td
                  className={`text-value ${reinstalled_shop_15_90_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showReinstallModal(3)}
                >
                  {reinstalled_shop_15_90_days !== 0 ? reinstalled_shop_15_90_days : ''}
                </td>
                <td>{checkAmount(re_average_diff_days_15_90_days)}</td>
              </tr>
              <tr>
                <td>91+ days</td>
                <td
                  className={`text-value ${uninstalled_shop_91_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showChurnModal(4)}
                >
                  {uninstalled_shop_91_days !== 0 ? uninstalled_shop_91_days : ''}
                </td>
                <td>91+ days</td>
                <td
                  className={`text-value  ${reinstalled_shop_91_days !== 0 ? '' : 'non-underline'}`}
                  onClick={() => showReinstallModal(4)}
                >
                  {reinstalled_shop_91_days !== 0 ? reinstalled_shop_91_days : ''}
                </td>
                <td>91+ days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      {showModalChurn && (
        <ModalChurnUninstall
          type={showModalChurn}
          disableModal={() => setShowModalChurn(null)}
          period={showModalChurn}
          appId={props.appId}
        />
      )}
      {showModalReinstall && (
        <ModalReinstall
          type={showModalReinstall}
          disableModal={() => setShowModalReinstall(null)}
          period={showModalReinstall}
          appId={props.appId}
        />
      )}
    </div>
  );
}
