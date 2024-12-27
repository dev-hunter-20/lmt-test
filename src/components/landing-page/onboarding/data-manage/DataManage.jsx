'use client';

import { dataAccessManagement } from '@/utils/data/onboarding';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import Image from 'next/image';
import React from 'react';

export default function DataManage(props) {
  const getStarted = () => {
    props.backToMain();
  };

  return (
    <>
      <Row className="step fade-in" justify="space-between">
        <Col span={17} className="img-step">
          <Image
            className="img-gif"
            src="/image/onboarding/datam-step-1.gif"
            alt=""
            width={100}
            height={500}
            unoptimized
          />
        </Col>
        <Col span={6} className="step-desc">
          <div className="title">
            Access data management
            <span>Enhance your data oversight by accessing comprehensive data management.</span>
          </div>
          <div className="item-desc">
            {dataAccessManagement.map((item, index) => (
              <Row key={item.addApp} className="step-feature">
                <Col span={3}>
                  <span>{index + 1}</span>
                </Col>
                <Col span={21}>
                  <div dangerouslySetInnerHTML={{ __html: item.dataManage }} />
                </Col>
              </Row>
            ))}
            <div className="footer-onboard">
              <Button
                color="default"
                variant="outlined"
                className="skip-onboard button-onboard"
                onClick={getStarted}
                size="large"
              >
                Back
              </Button>
              <Button type="primary" size="large" onClick={getStarted} className="button-onboard">
                Done <CheckOutlined />
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
