'use client';

import { Modal, Popconfirm, Switch, Table, Tooltip, message } from 'antd';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeleteFilled, PlusSquareFilled } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import update from 'immutability-helper';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './ModalSettingCompare.scss';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';

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

export default function ModalSettingCompare(props) {
  const [loading, setLoading] = useState(false);
  const [checkedAll, setCheckedAll] = useState();

  const handleOk = () => {
    props.setIsOpenSetting();
  };

  const dataTable = useMemo(() => {
    return props.compareApps.filter((item) => !Object.keys(item).includes('closable'));
  }, [props.compareApps]);

  useEffect(() => {
    if (!!dataTable.find((item) => !item.isFollow.isFollow)) {
      setCheckedAll(false);
      return;
    }
    setCheckedAll(true);
  }, [dataTable]);

  const saveOrder = async (listApp) => {
    setLoading(true);
    const host_id = props.compareApps[0].appId;
    const result = await DetailAppApiService.orderCompareApp(
      host_id,
      listApp.map((item) => item.appId),
    );
    message.info('Swap app item success');
    if (result && result.code === 0) {
      setLoading(false);
    } else {
      message.error('Error trying to save priority');
    }
  };

  const components = {
    body: {
      row: DraggableBodyRow,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const data = props.compareApps.filter((item) => !Object.keys(item).includes('closable'));
      const dragRow = data[dragIndex];
      const newList = update(data, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRow],
        ],
      });
      saveOrder(newList);
      props.setCompetitor([props.compareApps[0], ...newList]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props],
  );

  const handleFollowApp = async (checked, id) => {
    setLoading(true);
    const result = await DetailAppApiService.handleFollowApp(id, checked);
    if (result && result.code == 0) {
      setLoading(false);
      props.setCompetitor((prev) => {
        return prev.map((item) => {
          if (item.appId === id) {
            return {
              ...item,
              isFollow: {
                ...item.isFollow,
                isFollow: checked,
              },
            };
          }
          return item;
        });
      });
    } else {
      message.error('Follow app failed!');
    }
  };

  const handleFollowAll = async (apps, checked) => {
    setLoading(true);
    const result = await Promise.all(
      apps.map((item) => {
        return DetailAppApiService.handleFollowApp(item, checked);
      }),
    );
    setLoading(false);
    if (result && result[0].code == 0) {
      props.setCompetitor((prev) => {
        return prev.map((item) => {
          return {
            ...item,
            isFollow: {
              ...item.isFollow,
              isFollow: checked,
            },
          };
        });
      });
    } else {
      message.error('Follow app failed!');
    }
  };

  const removeApp = async (appId) => {
    setLoading(true);
    const result = await DetailAppApiService.deleteCompetitor(props.compareApps[0].appId, appId);
    setLoading(false);
    if (result && result.code == 0) {
      message.success('Remove app successfully!');
      props.setCompetitor((prev) => {
        return prev.filter((item) => item.appId !== appId);
      });
      return;
    } else {
      message.error('Remove app failed!');
    }
  };

  const handleCheckAll = (checked) => {
    setCheckedAll(checked);
    handleFollowAll(
      dataTable.map((item) => item.appId),
      checked,
    );
  };

  const columns = [
    {
      title: 'Compare app',
      dataIndex: 'name',
    },
    {
      title: (
        <>
          <Tooltip title="We will send you an email notification when the application is following change anything">
            <span style={{ fontWeight: 500 }}>Receive notification </span>
          </Tooltip>
          <Switch style={{ marginLeft: '10px' }} checked={checkedAll} onChange={(checked) => handleCheckAll(checked)} />
        </>
      ),
      dataIndex: 'isFollow',
      render: (item) => (
        <>
          <Switch checked={item ? item.isFollow : false} onChange={(checked) => handleFollowApp(checked, item.appId)} />
        </>
      ),
    },
    {
      width: 50,
      title: '',
      dataIndex: 'appId',
      render: (item) => (
        <div className="action-table-keyword">
          <Popconfirm title="Are you sure？" okText="Yes" cancelText="No" onConfirm={() => removeApp(item)}>
            <div className="remove-icon">
              <Tooltip title="Delete">
                <DeleteFilled twoToneColor="#ff4d4f" />
              </Tooltip>
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Modal
      width={'40%'}
      title={
        <>
          <span className="modal-title">
            Setting{' '}
            <Tooltip title="Add competitor">
              <PlusSquareFilled className="add-icon" onClick={() => props.addCompetitor()} />
            </Tooltip>
          </span>
        </>
      }
      className="modal-compare"
      visible={true}
      footer={null}
      onOk={handleOk}
      onCancel={handleOk}
    >
      <DndProvider backend={HTML5Backend}>
        <div className="text-note">* You can drag and drop to change the comparison app location</div>
        <Table
          columns={columns}
          dataSource={dataTable}
          pagination={false}
          loading={loading}
          components={components}
          onRow={(_, index) => {
            const attr = {
              index,
              moveRow,
            };
            return attr;
          }}
          scroll={{ y: 500 }}
        />
      </DndProvider>
    </Modal>
  );
}
