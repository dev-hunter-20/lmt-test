'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import './ChartInstallUnInstall.scss';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const date = payload[0].payload.year;
    return (
      <div
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: '#ffffff',
          padding: '10px',
          borderRadius: '4px',
        }}
      >
        <p style={{ fontWeight: 'bold' }}>{date}</p>
        {payload.map((entry, index) => (
          <div
            key={`item-${index}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '4px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: entry.color,
                marginRight: '8px',
              }}
            />
            <p style={{ margin: 0, fontSize: '12px' }}>
              {entry.name}: {entry.value}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLegend = ({ payload, hiddenDataset, toggleDataset, customOrder }) => {
  const orderedPayload = customOrder.map((key) => payload.find((item) => item.value === key)).filter(Boolean);

  return (
    <div className="custom-legend" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {orderedPayload.map((entry, index) => (
        <div key={`item-${index}`} style={{ display: 'flex' }}>
          <div
            style={{
              width: '12px',
              height: '12px',
              backgroundColor: entry ? entry.color : '#ddd',
              marginRight: '3px',
              marginLeft: '10px',
            }}
          />
          <p
            style={{
              textDecoration: hiddenDataset[entry.value] ? 'line-through' : 'none',
              color: '#000000',
              cursor: 'pointer',
              fontSize: '12px',
            }}
            onClick={() => toggleDataset(entry.value)}
          >
            {entry.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default function ChartInstallUnInstall(props) {
  const dataInstallByDate = props.value.install_by_date;
  const dataUnInstallByDate = props.value.uninstall_by_date;
  const [hiddenDatasetInstall, setHiddenDatasetInstall] = useState({
    Installs: false,
    'Re-opened stores': false,
    'Active Charge Merchants': false,
    'Charge Unfrozen Merchants': false,
  });
  const [hiddenDatasetUninstall, setHiddenDatasetUninstall] = useState({
    Uninstalls: false,
    Closed: false,
    Declined: false,
    'Charge Frozen Merchants': false,
    'Charge Canceled Merchants': false,
  });

  const toggleDatasetInstall = (dataKey) => {
    setHiddenDatasetInstall((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const toggleDatasetUninstall = (dataKey) => {
    setHiddenDatasetUninstall((prev) => ({
      ...prev,
      [dataKey]: !prev[dataKey],
    }));
  };

  const CustomLegendUninstalls = (props) => {
    const customOrder = ['Uninstalls', 'Closed', 'Declined', 'Charge Frozen Merchants', 'Charge Canceled Merchants'];
    return (
      <CustomLegend
        {...props}
        hiddenDataset={hiddenDatasetUninstall}
        toggleDataset={toggleDatasetUninstall}
        customOrder={customOrder}
      />
    );
  };

  const CustomLegendInstalls = (props) => {
    const customOrder = ['Installs', 'Re-opened stores', 'Active Charge Merchants', 'Charge Unfrozen Merchants'];
    return (
      <CustomLegend
        {...props}
        hiddenDataset={hiddenDatasetInstall}
        toggleDataset={toggleDatasetInstall}
        customOrder={customOrder}
      />
    );
  };

  const createData = (data, hiddenDataset, type) => {
    const labels = [...new Set(data.map((item) => item.date))].sort();
    const datasets = {
      Installs: [],
      'Re-opened stores': [],
      'Active Charge Merchants': [],
      'Charge Unfrozen Merchants': [],
      Uninstalls: [],
      Closed: [],
      Declined: [],
      'Charge Frozen Merchants': [],
      'Charge Canceled Merchants': [],
    };

    labels.forEach((label) => {
      const filteredData = data.filter((val) => val.date === label);
      if (filteredData.length > 0) {
        datasets['Installs'].push(filteredData.reduce((sum, val) => sum + (val.installed_shop_count || 0), 0) || null);
        datasets['Re-opened stores'].push(
          filteredData.reduce((sum, val) => sum + (val.reactivated_shop_count || 0), 0) || null,
        );
        datasets['Active Charge Merchants'].push(
          filteredData.reduce((sum, val) => sum + (val.active_charge_merchants || 0), 0) || null,
        );
        datasets['Charge Unfrozen Merchants'].push(
          filteredData.reduce((sum, val) => sum + (val.unfrozen_charge_merchants || 0), 0) || null,
        );

        datasets['Uninstalls'].push(
          filteredData.reduce((sum, val) => sum + (val.uninstalled_shop_count || 0), 0) || null,
        );
        datasets['Closed'].push(filteredData.reduce((sum, val) => sum + (val.deactivated_shop_count || 0), 0) || null);
        datasets['Declined'].push(filteredData.reduce((sum, val) => sum + (val.declined_shop_count || 0), 0) || null);
        datasets['Charge Frozen Merchants'].push(
          filteredData.reduce((sum, val) => sum + (val.frozen_charge_merchants || 0), 0) || null,
        );
        datasets['Charge Canceled Merchants'].push(
          filteredData.reduce((sum, val) => sum + (val.canceled_charge_merchants || 0), 0) || null,
        );
      }
    });

    return {
      labels,
      datasets: Object.entries(datasets).map(([label, data]) => ({
        label,
        data: hiddenDataset[label] ? data.map(() => null) : data,
      })),
    };
  };

  const convertData = (dataByDate, hiddenDataset, isInstall = true) => {
    if (!dataByDate) return [];

    const dataconvert = createData(dataByDate, hiddenDataset, isInstall);
    return dataconvert.labels.map((label, index) => ({
      year: label,
      ...dataconvert.datasets.reduce((acc, dataset) => {
        acc[dataset.label] = dataset.data[index];
        return acc;
      }, {}),
    }));
  };

  let dataColumnInstall = convertData(dataInstallByDate, hiddenDatasetInstall, true);
  let dataColumnUnInstall = convertData(dataUnInstallByDate, hiddenDatasetUninstall, false);

  const calculateTotal = (data, key) => {
    return data
      ? Math.round(data.map((item) => item[key]).reduce((sum, value) => sum + value, 0)).toLocaleString()
      : '';
  };

  const chartItems = [
    { title: 'Installs', key: 'installed_shop_count' },
    { title: 'Re-opened', key: 'reactivated_shop_count' },
    { title: 'Active Charge Merchants', key: 'active_charge_merchants' },
    { title: 'Charge Unfrozen Merchants', key: 'unfrozen_charge_merchants' },
  ];

  const uninstallItems = [
    { title: 'Uninstalls', key: 'uninstalled_shop_count' },
    { title: 'Closed', key: 'deactivated_shop_count' },
    { title: 'Declined', key: 'declined_shop_count' },
    { title: 'Charge Frozen Merchants', key: 'frozen_charge_merchants' },
    { title: 'Charge Canceled Merchants', key: 'canceled_charge_merchants' },
  ];

  return (
    <div className="row-install-uninstall">
      <div className="installs">
        <div className="title-chart">
          {chartItems.map((item, index) => (
            <div className="title-chart-item" key={index}>
              <div className="title">{item.title}</div>
              <div className="total-installs">
                <span>{calculateTotal(dataInstallByDate, item.key)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-installs">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={dataColumnInstall}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="year" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegendInstalls />} />
              <Bar
                dataKey="Re-opened stores"
                fill="#482779"
                stackId="in-re"
                hide={hiddenDatasetInstall['Re-opened stores']}
                barSize={30}
              />
              <Bar
                dataKey="Installs"
                fill="#41ad9f"
                stackId="in-re"
                hide={hiddenDatasetInstall.Installs}
                barSize={30}
              />
              <Bar
                dataKey="Charge Unfrozen Merchants"
                fill="#8B008B"
                stackId="ac"
                hide={hiddenDatasetInstall['Charge Unfrozen Merchants']}
                barSize={30}
              />
              <Bar
                dataKey="Active Charge Merchants"
                fill="#1E90FF"
                stackId="ac"
                hide={hiddenDatasetInstall['Active Charge Merchants']}
                barSize={30}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="uninstalls">
        <div className="title-chart">
          {uninstallItems.map((item, index) => (
            <div className="title-chart-item" key={index}>
              <div className="title">{item.title}</div>
              <div className="total-uninstalls">
                <span>{calculateTotal(dataUnInstallByDate, item.key)}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="chart-uninstalls">
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={dataColumnUnInstall}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis dataKey="year" />
              <YAxis />
              <RechartsTooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegendUninstalls />} />
              <Bar dataKey="Closed" fill="#482779" stackId="uc" hide={hiddenDatasetUninstall.Closed} barSize={30} />
              <Bar
                dataKey="Uninstalls"
                fill="#41ad9f"
                stackId="uc"
                hide={hiddenDatasetUninstall.Uninstalls}
                barSize={30}
              />
              <Bar dataKey="Declined" fill="#1E90FF" hide={hiddenDatasetUninstall.Declined} barSize={30} />
              <Bar
                dataKey="Charge Canceled Merchants"
                fill="#FF8C00"
                stackId="cc"
                hide={hiddenDatasetUninstall['Charge Canceled Merchants']}
                barSize={30}
              />
              <Bar
                dataKey="Charge Frozen Merchants"
                fill="#8B008B"
                stackId="cc"
                hide={hiddenDatasetUninstall['Charge Frozen Merchants']}
                barSize={30}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
