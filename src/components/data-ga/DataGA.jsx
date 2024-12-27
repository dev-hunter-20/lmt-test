'use client';

import React, { useEffect, useState } from 'react';
import { Table, Modal, Tooltip } from 'antd';
import queryString from 'query-string';
import dayjs from 'dayjs';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import './DataGA.scss';

export default function DataGA(props) {
  const [columns, setColumns] = useState([]);
  const [columnsGA, setColumnsGA] = useState();
  const [dataColumns, setDataColumns] = useState([]);
  const [dataGaDetail, setDataGaDetail] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const renderUPageViews = (data) => {
    if (data && +data.values[7]) {
      return data.values[7];
    }
    return 1;
  };

  const getDataDetail = async (date, field) => {
    setLoading(true);
    let data = {
      app_id: props.appId,
      date: date,
      field: field,
    };
    const result = await DetailAppApiService.getDataGa(data);
    if (result) {
      if (result.data && result.data.length > 0) {
        let dataGaDetail = result.data;
        var dataColumnsGA = [];

        let listColumnsParam = getDementsionsColumns(dataGaDetail);
        let initialColumnsGA = [
          {
            title: <Tooltip title={'PViews'}>PViews</Tooltip>,
            dataIndex: 'page_vieww',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.page_vieww - b.page_vieww,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'U.PViews'}>U.PViews</Tooltip>,
            dataIndex: 'u_page_vieww',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.u_page_vieww - b.u_page_vieww,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'Events'}>Events</Tooltip>,
            dataIndex: 'events',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.events - b.events,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'U.Events'}>U.Events</Tooltip>,
            dataIndex: 'u_events',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.u_events - b.u_events,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'CR'}>CR</Tooltip>,
            dataIndex: 'conversion_rate',
            defaultSortOrder: 'descend',
            sorter: (a, b) => sorterColumnPercent(a.conversion_rate, b.conversion_rate),
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'Bounce'}>Bounce</Tooltip>,
            dataIndex: 'bounce',
            defaultSortOrder: 'descend',
            sorter: (a, b) => sorterColumnPercent(a.bounce, b.bounce),
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'Avg.ToP'}>Avg.ToP</Tooltip>,
            dataIndex: 'avg_time',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.avg_time - b.avg_time,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'Users'}>Users</Tooltip>,
            dataIndex: 'users',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.users - b.users,
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'% E/U'}>% E/U</Tooltip>,
            dataIndex: 'events_per_users',
            defaultSortOrder: 'descend',
            sorter: (a, b) => sorterColumnPercent(a.events_per_users, b.events_per_users),
            width: 100,
            showSorterTooltip: false,
          },
          {
            title: <Tooltip title={'New User'}>New.U</Tooltip>,
            dataIndex: 'new_users',
            defaultSortOrder: 'descend',
            sorter: (a, b) => a.new_users - b.new_users,
            width: 100,
            showSorterTooltip: false,
          },
        ];

        const formatColumnTitle = (title) => {
          const maxLength = 20;
          return title.length > maxLength ? `${title.slice(0, maxLength)}...` : title;
        };

        const newColumns = listColumnsParam
          .filter((item) => item !== 'search_id' && item !== 'ot')
          .map((item, index) => ({
            title: <Tooltip title={item}>{formatColumnTitle(item)}</Tooltip>,
            dataIndex: item,
            width: 200,
            showSorterTooltip: false,
          }));

        let mergedColumnsGA = [...initialColumnsGA, ...newColumns];

        dataGaDetail.map((item, index) => {
          let listParamsDemensions = getDementsionsParam(item[0].dimensions[0]);
          let dataPush = {
            key: index,
            page_vieww: item[0].metrics[0].values[0],
            u_page_vieww: renderUPageViews(item[0].metrics[0]),
            events: item[0].metrics[0].values[1],
            u_events: item[0].metrics[0].values[2],
            bounce: (parseFloat(item[0].metrics[0].values[5]) * 100).toFixed(0) + '%',
            avg_time:
              item[0].metrics[0].values[6] || item[0].metrics[0].values[6] === 0
                ? dayjs(item[0].metrics[0].values[6] * 1000).format('mm:ss')
                : ' ',
            users: item[0].metrics[0].values[7],
            new_users: item[0].metrics[0].values[8],
            events_per_users:
              +item[0].metrics[0].values[1] && +item[0].metrics[0].values[7]
                ? parseFloat((100 * item[0].metrics[0].values[1]) / item[0].metrics[0].values[7]).toFixed(0) + '%'
                : ' ',
            conversion_rate: +item[0].metrics[0].values[2]
              ? parseFloat((100 * item[0].metrics[0].values[2]) / renderUPageViews(item[0].metrics[0])).toFixed(2) + '%'
              : ' ',
          };

          listParamsDemensions.map((item, index) => {
            dataPush[item.column] = item.value;
          });

          dataColumnsGA.push(dataPush);
        });
        setDataGaDetail(dataColumnsGA);
        setColumnsGA(mergedColumnsGA);
        setLoading(false);
      }
    }
  };

  const handleShowModal = async (date, field) => {
    await setshowModal(true);
    getDataDetail(date, field);
  };

  const sorterColumnPercent = (a, b) => {
    a.replace('%', '');
    b.replace('%', '');
    if (a === ' ') {
      a = 0;
    }
    if (b === ' ') {
      b = 0;
    }
    return parseFloat(a) - parseFloat(b);
  };

  function getDementsionsColumns(dataGA) {
    let dataReturn = [];
    dataGA.map((item, index) => {
      let dimensions = item[0].dimensions[0];
      let newDemensions = dimensions.split('?');
      newDemensions = queryString.parse(newDemensions[1]);

      Object.keys(newDemensions).map(function (key) {
        if (!dataReturn.includes(key.replace('surface_', '').replace('_position', ''))) {
          dataReturn.push(key.replace('surface_', '').replace('_position', ''));
        }
      });
    });

    return dataReturn;
  }

  function getDementsionsParam(dimensions) {
    let newDemensions = dimensions.split('?');
    newDemensions = queryString.parse(newDemensions[1]);
    let dataReturn = [];
    Object.keys(newDemensions).map(function (key) {
      dataReturn.push({
        column: key.replace('surface_', '').replace('_position', ''),
        value: newDemensions[key],
      });
    });
    return dataReturn;
  }

  useEffect(() => {
    if (props.value) {
      const arrayColumns = [
        {
          title: 'Date',
          dataIndex: 'date',
          sorter: (a, b) => new Date(a.date) - new Date(b.date),
          render: (text) => text,
          showSorterTooltip: false,
          width: 120,
        },
        {
          title: 'Search',
          dataIndex: 'search_count',
          sorter: (a, b) => (a.search_count || 0) - (b.search_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'search')} className="title-data">
              {record.search_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Ads',
          dataIndex: 'search_ad_count',
          sorter: (a, b) => (a.search_ad_count || 0) - (b.search_ad_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'ads')} className="title-data">
              {record.search_ad_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Cats',
          dataIndex: 'category_count',
          sorter: (a, b) => (a.category_count || 0) - (b.category_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'category')} className="title-data">
              {record.category_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Cols',
          dataIndex: 'collection_count',
          sorter: (a, b) => (a.collection_count || 0) - (b.collection_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'collection')} className="title-data">
              {record.collection_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Home',
          dataIndex: 'home_count',
          sorter: (a, b) => (a.home_count || 0) - (b.home_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'home')} className="title-data">
              {record.home_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Partners',
          dataIndex: 'partner_count',
          sorter: (a, b) => (a.partner_count || 0) - (b.partner_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'partner')} className="title-data">
              {record.partner_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: 'Stories',
          dataIndex: 'story_count',
          sorter: (a, b) => (a.story_count || 0) - (b.story_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'story')} className="title-data">
              {record.story_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'Other',
          dataIndex: 'other_count',
          sorter: (a, b) => (a.other_count || 0) - (b.other_count || 0),
          render: (text, record) => (
            <span onClick={() => handleShowModal(record.date, 'other')} className="title-data">
              {record.other_count || ' '}
            </span>
          ),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'PViews',
          dataIndex: 'pageviews',
          sorter: (a, b) => (a.pageviews || 0) - (b.pageviews || 0),
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: 'U.PViews',
          dataIndex: 'uniquePageviews',
          sorter: (a, b) => (a.uniquePageviews || 0) - (b.uniquePageviews || 0),
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: 'Events',
          dataIndex: 'totalEvents',
          sorter: (a, b) => (a.totalEvents || 0) - (b.totalEvents || 0),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'U.Events',
          dataIndex: 'uniqueEvents',
          sorter: (a, b) => (a.uniqueEvents || 0) - (b.uniqueEvents || 0),
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: '%CR',
          dataIndex: 'conversion_rate',
          sorter: (a, b) => parseFloat(a.conversion_rate) - parseFloat(b.conversion_rate),
          render: (text) => <>{text}%</>,
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: '%Bounce',
          dataIndex: 'bounceRate',
          sorter: (a, b) => parseFloat(a.bounceRate) - parseFloat(b.bounceRate),
          render: (text) => <>{text}%</>,
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: 'Avg.ToP',
          dataIndex: 'avgTimeOnPage',
          sorter: (a, b) => a.avgTimeOnPage - b.avgTimeOnPage,
          render: (text) => (text ? dayjs(text * 1000).format('mm:ss') : ' '),
          showSorterTooltip: false,
          width: 100,
        },
        {
          title: 'Users',
          dataIndex: 'users',
          sorter: (a, b) => (a.users || 0) - (b.users || 0),
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: '%EpU',
          dataIndex: 'events_per_users',
          sorter: (a, b) => parseFloat(a.events_per_users) - parseFloat(b.events_per_users),
          render: (text) => <>{text}%</>,
          showSorterTooltip: false,
          width: 80,
        },
        {
          title: 'New.U',
          dataIndex: 'newUsers',
          sorter: (a, b) => (a.newUsers || 0) - (b.newUsers || 0),
          showSorterTooltip: false,
          width: 80,
        },
      ];

      const dataColumns = props.value.map((item, index) => ({
        key: index,
        date: item.date,
        search_count: item.search_count,
        search_ad_count: item.search_ad_count,
        story_count: item.story_count,
        category_count: item.category_count,
        collection_count: item.collection_count,
        home_count: item.home_count,
        partner_count: item.partner_count,
        other_count: item.other_count,
        pageviews: item.pageviews,
        uniquePageviews: item.uniquePageviews,
        totalEvents: item.totalEvents,
        uniqueEvents: item.uniqueEvents,
        conversion_rate: ((item.uniqueEvents * 100) / item.uniquePageviews).toFixed(2),
        bounceRate: item.bounceRate.toFixed(2),
        avgTimeOnPage: item.avgTimeOnPage,
        users: item.users,
        events_per_users: ((item.totalEvents * 100) / item.users).toFixed(2),
        newUsers: item.newUsers,
      }));

      setColumns(arrayColumns);
      setDataColumns(dataColumns);
    }
  }, [props]);

  return (
    <div className="data-from-ga-detail">
      <div className="title-table">Data From GA</div>
      <Table pagination={false} columns={columns} dataSource={dataColumns} scroll={{ x: 'max-content', y: 600 }} />

      <Modal
        width={'80%'}
        title="Traffic in details"
        visible={showModal}
        footer={null}
        onCancel={() => setshowModal(false)}
      >
        <Table
          scroll={{ x: 'max-content', y: 600 }}
          columns={columnsGA}
          pagination={false}
          dataSource={dataGaDetail}
          loading={loading}
        />
      </Modal>
    </div>
  );
}
