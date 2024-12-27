'use client';

import React, { useCallback, useRef, useState } from 'react';
import { Popconfirm, Table, message, Tooltip, Avatar, Progress, Tag } from 'antd';
import {
  AreaChartOutlined,
  DeleteFilled,
  DownOutlined,
  ReloadOutlined,
  UpOutlined,
  QuestionCircleOutlined,
  CheckCircleFilled,
  CopyOutlined,
} from '@ant-design/icons';
import './TableKeyword.scss';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/utc';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { renderDifficulty, scoreCalculate } from '@/utils/functions';
import Image from 'next/image';
import Link from 'next/link';
import CopyToClipboard from 'react-copy-to-clipboard';

dayjs.extend(duration);

const type = 'DraggableBodyRow';
const DraggableBodyRow = ({ index, moveRow, className, style, ...restProps }) => {
  const ref = useRef(null);
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: {
      index,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{
        cursor: 'move',
        ...style,
      }}
      {...restProps}
    />
  );
};

const getKeywordLink = (key) => {
  return `https://www.google.com/search?q=${key}`;
};

const TableKeyword = (props) => {
  const [loadingSearch, setLoadingSearch] = useState(false);
  const detail = props.infoApp?.data?.detail;
  const [copyText, setCopyText] = useState({
    keyword: {
      copied: false,
    },
  });
  const countKeyword = props.countKeyword;
  const setModalShow = props.setModalShow;

  const saveOrder = async (listKeyword) => {
    setLoadingSearch(true);
    const result = await DetailAppApiService.saveKeywordPriority(props.appId, listKeyword);
    if (result && result.code === 0) {
      message.success('Swap keyword position in item successfully');
      setLoadingSearch(false);
    } else {
      message.error('Error trying to save priority');
    }
  };

  const reloadKeywordItem = (keyword) => async () => {
    const result = await DetailAppApiService.reloadKeywordItem(props.appId, keyword);
    if (result.code === 0) {
      message.success('Reload keyword item success');
    } else {
      message.error('Reload keyword item error');
    }
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = props.dataKeywordsShow[dragIndex];
      const newList = update(props.dataKeywordsShow, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });

      props.setDataKeywordsShow(newList);
      saveOrder(newList.map((item) => item.keyword.keyword));
    },
    [props.dataKeywordsShow],
  );

  const sorterColumn = (a, b) => {
    a.toString().replace('%', '');
    b.toString().replace('%', '');
    if (a === ' ') {
      a = 0;
    }
    if (b === ' ') {
      b = 0;
    }
    return parseFloat(a) - parseFloat(b);
  };

  const sorterColumnTime = (a, b) => {
    if (a === ' ') {
      a = dayjs(0).format('mm:ss');
    }
    if (b === ' ') {
      b = dayjs(0).format('mm:ss');
    }
    return dayjs.duration(a).asHours() - dayjs.duration(b).asHours();
  };

  const sorterColumnBounce = (a, b) => {
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

  const onCopyText = () => {
    const copyTextNew = {};
    Object.assign(copyTextNew, copyText);
    copyTextNew.keyword.copied = true;
    setCopyText(copyTextNew);
    message.success('Copy keyword success');
  };

  const columnsKeyword = [
    {
      title: 'Keywords',
      dataIndex: 'keyword',
      width: 200,
      fixed: 'left',
      render: (item) => (
        <div className="keyword-text">
          <div className="link">
            <Link href={'/key/' + item.keyword_slug} prefetch={false}>
              {item.keyword}
            </Link>
          </div>
          <CopyToClipboard onCopy={onCopyText} text={item.keyword}>
            <Tooltip title={'Copy'} placement="top">
              <CopyOutlined />
            </Tooltip>
          </CopyToClipboard>
        </div>
      ),
    },
    {
      title: 'Top 5 apps',
      dataIndex: 'rank',
      width: 180,
      render: (item) => (
        <Avatar.Group>
          {item.top_5_apps && item.top_5_apps.length > 0
            ? item.top_5_apps.map((item, index) => (
                <Tooltip key={index} title={item.app_name} placement="top">
                  <Link prefetch={false} href={`${item.app_id}`}>
                    <Avatar
                      style={{
                        cursor: 'pointer',
                        margin: '0 1px',
                        border: item.app_id === props.appId ? '2px solid #ff9900' : '1px solid white',
                        boxShadow: item.app_id === props.appId ? '0 0 10px rgba(255, 0, 0, 1)' : 'none',
                      }}
                      src={item.app_icon}
                    />
                  </Link>
                </Tooltip>
              ))
            : ' '}
        </Avatar.Group>
      ),
    },
    {
      title: (
        <Tooltip title="Based on total search results">
          Difficulty <QuestionCircleOutlined style={{ color: '#90', marginLeft: '3px' }} />
        </Tooltip>
      ),
      dataIndex: 'rank',
      width: 160,
      render: (item) => (
        <div className="flex items-center">
          {item.total_apps ? (
            <>
              <Tooltip title={`${item.total_apps} results`}>
                <Tag className="difficult-tag" color={renderDifficulty(item.total_apps).color}>
                  {scoreCalculate(item.total_apps)}
                </Tag>
              </Tooltip>
              <Tooltip title={renderDifficulty(item.total_apps).difficulty}>
                <Progress
                  percent={(item.total_apps / 900) * 100}
                  strokeColor={renderDifficulty(item.total_apps).color}
                  showInfo={false}
                  trailColor="#ccc"
                  className="difficulty"
                />
              </Tooltip>
            </>
          ) : (
            ' '
          )}
        </div>
      ),
    },
    {
      title: <Tooltip title="App Ranking Position">Position</Tooltip>,
      dataIndex: 'rank_position',
      width: 110,
      sorter: (a, b) => sorterColumn(a.rank.rank || ' ', b.rank.rank || ' '),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      render: (item) => (
        <>
          <div className="detail-position" onClick={props.openDetailPosition(item)}>
            {item.rank || ' '}
            {item.before_rank && item.rank && item.before_rank - item.rank > 0 ? (
              <span className="calular-incre">
                <UpOutlined /> {item.before_rank - item.rank}{' '}
              </span>
            ) : (
              ''
            )}
            {item.before_rank && item.rank && item.before_rank - item.rank < 0 ? (
              <span className="calular-decre">
                <DownOutlined /> {item.rank - item.before_rank}{' '}
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: <Tooltip title="Popular Position">P.Popular</Tooltip>,
      dataIndex: 'rank_popular',
      sorter: (a, b) => sorterColumn(a.rank.rank_popular || ' ', b.rank.rank_popular || ' '),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
      width: 110,
      render: (item) => (
        <>
          <div className="detail-position" onClick={props.openDetailPositionPopular(item)}>
            {item.rank_popular || ' '}
            {item.before_rank_popular && item.rank_popular && item.before_rank_popular - item.rank_popular > 0 ? (
              <span className="calular-incre">
                <UpOutlined /> {item.before_rank_popular - item.rank_popular}{' '}
              </span>
            ) : (
              ''
            )}
            {item.before_rank_popular && item.rank_popular && item.before_rank_popular - item.rank_popular < 0 ? (
              <span className="calular-decre">
                <DownOutlined /> {item.rank_popular - item.before_rank_popular}{' '}
              </span>
            ) : (
              ''
            )}
          </div>
        </>
      ),
    },
    {
      title: <Tooltip title="Unique Pageviews">U.Pviews</Tooltip>,
      dataIndex: 'uniquePageviews',
      width: 100,
      sorter: (a, b) => sorterColumn(a.uniquePageviews, b.uniquePageviews),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: <Tooltip title="Unique Events">U.Events</Tooltip>,
      dataIndex: 'uniqueEvents',
      width: 110,
      sorter: (a, b) => sorterColumn(a.uniqueEvents, b.uniqueEvents),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: <Tooltip title="Conversion Rate">%CR</Tooltip>,
      dataIndex: 'conversion_rate',
      width: 100,
      sorter: (a, b) => sorterColumn(a.conversion_rate, b.conversion_rate),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: <Tooltip title="Average Time on Page">Avg.ToP</Tooltip>,
      dataIndex: 'avgTimeOnPage',
      width: 100,
      sorter: (a, b) => sorterColumnTime(a.avgTimeOnPage, b.avgTimeOnPage),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: <Tooltip title="Bounce Rate">%Bounce</Tooltip>,
      dataIndex: 'bounceRate',
      width: 100,
      sorter: (a, b) => sorterColumnBounce(a.bounceRate, b.bounceRate),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      title: <Tooltip title="Average Position">Avg Position</Tooltip>,
      dataIndex: 'avgPos',
      width: 130,
      sorter: (a, b) => sorterColumn(a.avgPos, b.avgPos),
      sortDirections: ['descend', 'ascend'],
      showSorterTooltip: false,
    },
    {
      width: 140,
      dataIndex: 'keyword',
      render: (item) => (
        <div className="action-table-keyword">
          <Tooltip title="Search by google">
            <div className="icon-google">
              <Link prefetch={false} href={getKeywordLink(item.keyword)} target="blank">
                <Image src="/image/icons8-google.svg" height={10} width={10} alt="diamond" className="diamond-icon" />
              </Link>
            </div>
          </Tooltip>
          <Tooltip title="Reload">
            <div className="icon-reload" onClick={reloadKeywordItem(item.keyword)}>
              <ReloadOutlined />
            </div>
          </Tooltip>
          <Tooltip title={item.show_in_chart ? 'Hide in chart' : 'Show in chart'}>
            <div className="badge-keyword">
              <AreaChartOutlined
                style={{
                  color: item.show_in_chart ? '#1A90FF' : '',
                }}
                onClick={() => props.changeShowbadge(item)}
              />
            </div>
          </Tooltip>
          <div className="icon-action-keyword">
            <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={props.removeKeyword(item)}>
              <div className="remove">
                <DeleteFilled />
              </div>
            </Popconfirm>
          </div>
        </div>
      ),
    },
    {
      title: <div>Name</div>,
      dataIndex: 'name',
      width: 70,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>Tagline</div>,
      dataIndex: 'tagline',
      width: 80,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>KBT</div>,
      dataIndex: 'kbTitle',
      width: 60,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>KBD</div>,
      dataIndex: 'kbDesc',
      width: 60,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>Desc</div>,
      dataIndex: 'desc',
      width: 65,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>SCA</div>,
      dataIndex: 'alt',
      width: 60,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>PN</div>,
      dataIndex: 'planName',
      width: 60,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
    {
      title: <div>PD</div>,
      dataIndex: 'planDetail',
      width: 50,
      fixed: 'right',

      render: (item) => (
        <>
          {item ? (
            <span>
              <CheckCircleFilled className="show-icon" />
            </span>
          ) : (
            ' '
          )}
        </>
      ),
    },
  ];

  const checkShow = (value1, value2) => {
    if (value1) {
      return value1.toLowerCase().includes(value2.toLowerCase());
    }
    return false;
  };

  const checkShowAlt = (array, value) => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].alt && array[i].alt.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  };

  const checkShowKbTitle = (array, value) => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].title && array[i].title.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  };

  const checkShowKbDesc = (array, value) => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].description && array[i].description.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
    }

    return false;
  };
  const checkShowPlanName = (array, value) => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].title && array[i].title.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  };
  const checkShowPlanDetail = (array, value) => {
    if (array) {
      for (let i = 0; i < array.length; i++) {
        if (array[i].desc && array[i].desc.toLowerCase().includes(value.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  };

  const dataTable = (dataKeywordsShow, detail) => {
    const data = [];
    dataKeywordsShow &&
      dataKeywordsShow?.map((item) => {
        data.push({
          ...item,
          rank_position: item.rank,
          rank_popular: item.rank,
          name: checkShow(detail?.name, item.keyword.keyword),
          tagline: checkShow(detail?.tagline, item.keyword.keyword),
          kbTitle: checkShowKbTitle(detail?.features, item.keyword.keyword),
          kbDesc: checkShowKbDesc(detail?.features, item.keyword.keyword),
          alt: checkShowAlt(detail?.img, item.keyword.keyword),
          desc: checkShow(detail?.description, item.keyword.keyword),
          planName: checkShowPlanName(detail?.pricing_plan, item.keyword.keyword),
          planDetail: checkShowPlanDetail(detail?.pricing_plan, item.keyword.keyword),
        });
      });
    return data;
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        columns={columnsKeyword}
        dataSource={dataTable(props.dataKeywordsShow, detail)}
        pagination={false}
        scroll={{ x: 1050, y: 500 }}
        onChange={props.onChangeSort}
        loading={props.loading || loadingSearch}
        components={props.tabKey == 1 ? components : null}
        onRow={(_, index) => {
          const attr = {
            index,
            moveRow,
          };
          return attr;
        }}
        footer={() => (
          <>
            {countKeyword > 0 && props.infoApp && props.infoApp.gaConnected && (
              <div className="count-false" onClick={() => setModalShow('isVisibleKeywordHidden')}>
                <span>
                  Appear on <b>{countKeyword}</b> other keywords
                </span>
              </div>
            )}
          </>
        )}
      />
    </DndProvider>
  );
};

export default TableKeyword;
