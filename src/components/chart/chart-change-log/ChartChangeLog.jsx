'use client';

import React, { useMemo, useState } from 'react';
import { ArrowRightOutlined } from '@ant-design/icons';
import { Empty, Modal, Spin } from 'antd';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ReactDiffViewer from 'react-diff-viewer';
import Image from 'next/image';
import './ChartChangeLog.scss';

export default function ChartChangeLog(props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [dataPopup, setDataPopup] = useState([]);
  const [hoveredData, setHoveredData] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const dataConvert = useMemo(() => props.value, [props.value]);

  const filteredData = useMemo(() => {
    if (!dataConvert || !dataConvert.datasets) return [];
    return dataConvert.datasets.filter((dataset) => {
      // Lọc dữ liệu, chỉ giữ lại những mục có thay đổi (y > 0)
      return dataset.data.some((item) => item.y > 0);
    });
  }, [dataConvert]);

  const CustomShape = (props) => {
    const { cx, cy, fill, shape, radius } = props;
    const iconSize = 15;

    if (shape === 'diamond') {
      return (
        <image
          xlinkHref={'/image/diamond.svg'}
          x={cx - iconSize / 2}
          y={cy - iconSize / 2}
          width={iconSize}
          height={iconSize}
        />
      );
    } else if (shape === 'close') {
      return (
        <image
          xlinkHref={'/image/closeIcon.svg'}
          x={cx - iconSize / 2}
          y={cy - iconSize / 2}
          width={iconSize}
          height={iconSize}
        />
      );
    }
    return <circle cx={cx} cy={cy} r={radius} fill={fill} />;
  };

  const getPointRadius = (value, isHovered) => {
    return isHovered ? 5 : value.y === 12 ? 4 : 3;
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        tooltipVisible && (
          <div
            className="custom-tooltip"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 1)',
              color: '#000000',
              padding: '10px',
              borderRadius: '4px',
              boxShadow: '1px 2px 2px rgba(0, 0, 0, 0.5)',
              border: '1px solid #DCDCDC',
              display: 'flex',
              flexDirection: 'column',
            }}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <span style={{ fontWeight: 500 }}>{data.x}</span>
            <span
              style={{ color: '#007bff', cursor: 'pointer', marginTop: '10px' }}
              onClick={() => {
                setIsModalVisible(true);
                setDataPopup(data);
              }}
            >
              Click for details
            </span>
          </div>
        )
      );
    }
    return null;
  };

  const labels = [
    'Integrations',
    'Highlights',
    'App icon',
    'Video',
    'Description',
    'Pricing Plan',
    'Pricing',
    'Screenshots',
    'Features',
    'Tagline',
    'Name',
    'Built For Shopify',
  ];

  const generateChangeLogText = () => {
    // Tính toán tổng số thay đổi, số lần thay đổi giá, số lần thay đổi tính năng
    const totalChanges = filteredData[0]?.data?.length || 0; // Tổng số thay đổi (số lượng phần tử trong data)

    // Đếm số lần thay đổi pricing_plan
    const pricingPlanChanges = filteredData[0]?.data?.filter((item) => item.type === 'pricing_plan').length || 0;

    // Tính loại thay đổi chính (loại thay đổi xuất hiện nhiều nhất)
    const changeTypes = filteredData[0]?.data?.map((item) => item.type);
    const mainChangeType = changeTypes?.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const mostFrequentChangeType =
      mainChangeType && Object.keys(mainChangeType).length > 0
        ? Object.keys(mainChangeType).reduce((a, b) => (mainChangeType[a] > mainChangeType[b] ? a : b))
        : null;

    // Lấy số lượng của loại thay đổi xuất hiện nhiều nhất
    const mostFrequentChangeCount = mostFrequentChangeType ? mainChangeType[mostFrequentChangeType] : 0;

    // Tìm ngày thay đổi gần nhất
    const latestPricingPlanChangeDate = filteredData[0]?.data
      ?.filter((item) => item.type === 'pricing_plan')
      .reduce((latestDate, item) => {
        return new Date(item.x) > new Date(latestDate) ? item.x : latestDate;
      }, '1970-01-01');

    // Đếm số lần thay đổi tính năng
    const featureChanges = filteredData[0]?.data?.filter((item) => item.type === 'features').length || 0;

    const monthsBetween = (startDate, endDate) => {
      let yearsDiff = endDate.getFullYear() - startDate.getFullYear();
      let monthsDiff = endDate.getMonth() - startDate.getMonth();

      return yearsDiff * 12 + monthsDiff;
    };

    // Lấy ngày đầu tiên và ngày cuối
    const firstDateString = filteredData[0]?.data?.[0]?.x;
    const lastDateString = filteredData[0]?.data?.[filteredData[0]?.data.length - 1]?.x;

    const firstDate = new Date(firstDateString);
    const lastDate = new Date(lastDateString);

    const totalMonths = monthsBetween(firstDate, lastDate);
    const nameApp = props?.infoApp?.data?.detail?.name || ' ';

    return (
      <div className="change-log-summary">
        <span className="change-log-desc">
          Our change log tracking for <strong>{nameApp}</strong> has recorded all the changes in its app listing on the
          Shopify App Store.
        </span>
        <span className="change-log-desc">
          In the past <strong>{totalMonths}</strong> months, <strong>{nameApp}</strong> has the total of{' '}
          <strong>{totalChanges}</strong> changes, mostly in{' '}
          <strong>
            {mostFrequentChangeType && mostFrequentChangeType.charAt(0).toUpperCase() + mostFrequentChangeType.slice(1)}
          </strong>{' '}
          with <strong>{mostFrequentChangeCount}</strong> times.
        </span>
        <span className="change-log-desc">
          <strong>{nameApp}</strong> has modified their pricing plan <strong>{pricingPlanChanges}</strong> times with
          the latest change made on <strong>{latestPricingPlanChangeDate}</strong>.
        </span>
        <span className="change-log-desc">
          Its feature information has been updated <strong>{featureChanges}</strong> times.
        </span>
        <span className="change-log-desc">For more details, check Letsmetrix records below:</span>
      </div>
    );
  };

  return (
    <>
      <div className="popup-change-log">
        <Modal
          width={1500}
          title={'Data change log - ' + dataPopup.x}
          visible={isModalVisible}
          footer={null}
          onCancel={() => setIsModalVisible(false)}
        >
          {dataPopup && (
            <div className="content-popup-change-log">
              {[
                'title',
                'description',
                'name',
                'tagline',
                'pricing',
                'pricing_plan',
                'video',
                'features',
                'highlights',
                'integrations',
                'built_for_shopify',
              ].includes(dataPopup.type) && dataPopup.data ? (
                <ReactDiffViewer
                  oldValue={dataPopup.data.before || ''}
                  newValue={dataPopup.data.after || ''}
                  splitView={true}
                />
              ) : dataPopup.type === 'img' && dataPopup.data ? (
                <>
                  <table className="image-diff">
                    <tbody>
                      <tr>
                        <td>
                          {dataPopup.data.before.dataImg &&
                            dataPopup.data.before.dataImg.map((item, index) => (
                              <div key={index}>
                                <Image width={415} height={242} src={item.src} alt={item.alt} />
                                <div className="alt">{item.alt}</div>
                              </div>
                            ))}
                        </td>
                        <td className="image-diff-arrow">
                          {dataPopup.data.before.dataImg &&
                            dataPopup.data.before.dataImg.map((_, index) => (
                              <div key={index}>
                                <ArrowRightOutlined />
                              </div>
                            ))}
                        </td>
                        <td>
                          {dataPopup.data.after.dataImg &&
                            dataPopup.data.after.dataImg.map((item, index) => (
                              <div key={index}>
                                <Image width={415} height={242} src={item.src} alt={item.alt} />
                                <div className="alt">{item.alt}</div>
                              </div>
                            ))}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <ReactDiffViewer
                    oldValue={dataPopup.data.before.changeLog || ''}
                    newValue={dataPopup.data.after.changeLog || ''}
                    splitView={true}
                  />
                </>
              ) : dataPopup.type === 'app_icon' && dataPopup.data ? (
                <div>
                  <div className="icon-diff">
                    <div className="before">
                      {dataPopup.data.before && (
                        <Image width={150} height={150} src={dataPopup.data.before} alt="before" />
                      )}
                    </div>
                    <div className="move">
                      <ArrowRightOutlined />
                    </div>
                    <div className="after">
                      {dataPopup.data.after && (
                        <Image width={150} height={150} src={dataPopup.data.after} alt="after" />
                      )}
                    </div>
                  </div>
                  <ReactDiffViewer
                    oldValue={dataPopup.data.before || ''}
                    newValue={dataPopup.data.after || ''}
                    splitView={true}
                  />
                </div>
              ) : (
                ''
              )}
            </div>
          )}
        </Modal>
      </div>
      <div className="block-header">
        Change Log Tracking
        <div className="change-log-text">{filteredData && filteredData.length > 0 ? generateChangeLogText() : ''}</div>
      </div>
      <div className={`${props.loading ? 'chart-loading' : 'chart'}`} id="chart-log_tracking">
        {props.loading ? (
          <Spin />
        ) : filteredData && filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <ScatterChart margin={{ top: 20, left: 30, right: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis type="category" dataKey="x" />
              <YAxis
                type="number"
                dataKey="y"
                ticks={labels.map((_, idx) => idx + 1)}
                tickFormatter={(value) => labels[value - 1]}
              />
              <RechartsTooltip wrapperStyle={{ pointerEvents: 'auto' }} content={<CustomTooltip />} />
              <Legend
                formatter={(value) => (
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#000000',
                      cursor: 'pointer',
                    }}
                  >
                    {value}
                  </span>
                )}
              />
              {filteredData.map((dataset, index) => (
                <Scatter
                  key={index}
                  name={dataset.label}
                  data={dataset.data}
                  fill={dataset.backgroundColor}
                  isAnimationActive={true}
                  animationDuration={500}
                  shape={(props) => {
                    const point = props.payload;
                    const isHovered = hoveredData && hoveredData.payload === point;
                    return (
                      <CustomShape
                        {...props}
                        shape={point.y === 12 ? (point.data.before ? 'close' : 'diamond') : 'circle'}
                        radius={getPointRadius(point, isHovered)}
                      />
                    );
                  }}
                  onMouseEnter={(e) => {
                    setTooltipVisible(true);
                    setHoveredData(e);
                  }}
                  onMouseLeave={() => {
                    setTooltipVisible(false);
                    setHoveredData(null);
                  }}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        ) : (
          <Empty />
        )}
      </div>
    </>
  );
}
