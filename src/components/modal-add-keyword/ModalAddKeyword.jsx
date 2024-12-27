'use client';

import { Button, Form, Modal, Select, Tag, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import './ModalAddKeyword.scss';

export default function ModalAddKeyword(props) {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [dataSelect, setDataSelect] = useState([]);

  const handleOk = () => {
    props.handleEditOk();
  };

  const fetchSuggestKeyword = async (id) => {
    const result = await DetailAppApiService.getSuggestKeyword(id);
    if (result && result.code == 0) {
      setData(result.keywords.filter((item) => !props.keywordExist.map((key) => key.keyword.keyword).includes(item)));
    }
  };

  useEffect(() => {
    fetchSuggestKeyword(props.id);
  }, []);

  const addKeyword = (key) => {
    const fieldValue = form.getFieldValue('keyName');
    form.setFieldsValue({
      keyName: fieldValue ? [...fieldValue, key] : [key],
    });
    setDataSelect((prev) => [...prev, key]);
    setData((prev) => prev.filter((item) => item !== key));
  };

  const onChange = async (values) => {
    const newKeyword = values[values.length - 1];
    const result = await DetailAppApiService.checkExistsUserKeyword(props.id, newKeyword);

    if (result && result.code === 1) {
      message.error(`Keyword "${newKeyword}" already exists !`);
      form.setFieldsValue({ keyName: values.slice(0, -1) });
      return;
    } else {
      setDataSelect(values);
      form.setFieldsValue({ keyName: values });
    }
  };

  const checkAction = (dataSelect, item) => {
    if (dataSelect.includes(item)) {
      return;
    }
    if (dataSelect.length >= 5) {
      message.error('Cannot add more than 5 keywords');
      return;
    }
    addKeyword(item);
  };

  const onFinish = async (values) => {
    let isDuplicate = false;
  
    for (const keyword of values.keyName) {
      const result = await DetailAppApiService.checkExistsUserKeyword(props.id, keyword);
      if (result && result.code === 1) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      props.saveKeyword(values);
    }
  };

  return (
    <Modal width={550} title="Add Keyword" footer={null} visible={true} onOk={handleOk} onCancel={handleOk}>
      <div className="popup-edit-keyword">
        <div className="input-keyword">
          <Form form={form} layout="vertical" className="form-edit" onFinish={onFinish}>
            <Form.Item
              label="Keywords"
              name="keyName"
              required
              rules={[
                {
                  required: true,
                  message: 'Please enter keywords',
                },
              ]}
            >
              <Select
                mode="tags"
                style={{
                  width: '100%',
                }}
                notFoundContent={null}
                open={false}
                onChange={onChange}
              />
            </Form.Item>
            {data && data.length > 0 && (
              <Form.Item className="suggest-keyword">
                <div className="suggest-keyword-note">* List of keywords related obtained from AI bot</div>
                <>
                  {data.map((item, index) => (
                    <Tag
                      key={index}
                      onClick={() => checkAction(dataSelect, item)}
                      className="suggest-keyword-tag"
                      color={dataSelect.includes(item) ? 'blue' : 'default'}
                      style={{
                        cursor: dataSelect.includes(item) ? 'default' : 'pointer',
                      }}
                    >
                      {item} {dataSelect.includes(item) ? <></> : <PlusOutlined />}
                    </Tag>
                  ))}
                </>
              </Form.Item>
            )}
            <Form.Item>
              <Button htmlType="submit" className="button-edit" type="primary" style={{ width: '100%' }}>
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
