'use client';
import { useState } from 'react';
import './ModalConnectShopify.scss';
import { Button, Form, Input, Modal, message } from 'antd';
import ShopifyApiService from '@/api-services/api/ShopifyApiService';
import Link from 'next/link';

const ModalConnectShopify = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleOk = () => {
    props.disableModal();
  };

  const handleCancel = () => {
    props.disableModal();
  };

  const listPartner = props.listPartner.map((partner) => partner.partner_api_id);

  const connectShopifyApi = async (values) => {
    setIsLoading(true);
    const data = {
      apiKey: values.apiKey,
      partnerId: values.partnerId,
    };
    try {
      const result = await ShopifyApiService.connectPartnerApi(data);
      if (result && result.code === 0) {
        message.success('Connect shopify api success');
        props.setNewPartnerId(values.partnerId);
        props.disableModal();
      } else {
        message.error('Connect shopify api error');
      }
    } catch (error) {
      message.error('An error occurred while connecting to Shopify API');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal width={420} title="Connect Shopify Api" visible={true} footer={null} onOk={handleOk} onCancel={handleCancel}>
      <div className="popup-connect-shopify-api">
        <Form form={form} name="connectShopify" onFinish={connectShopifyApi} layout="vertical">
          <Form.Item
            label="Partner ID"
            name="partnerId"
            rules={[
              { required: true, message: 'Partner ID is required' },
              {
                //kiểm tra Partner ID đã tồn tại
                validator: (_, value) => {
                  if (!value || !listPartner.includes(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('This Partner ID already exists'));
                },
              },
            ]}
          >
            <Input placeholder="Partner ID" />
          </Form.Item>
          <Form.Item label="API Key" name="apiKey" rules={[{ required: true, message: 'API Key is required' }]}>
            <Input placeholder="API Key" />
          </Form.Item>
          <div className="link-usage">
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.letsmetrix.com/get-started/connect-shopify-api"
              prefetch={false}
            >
              How to get Partner ID and Api key
            </Link>
          </div>
          <div className="button-connect-shopify-api">
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Connect
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default ModalConnectShopify;
