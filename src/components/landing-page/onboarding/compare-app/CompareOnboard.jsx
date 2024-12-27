'use client';

import { dataCompareApps } from '@/utils/data/onboarding';
import { CheckOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import Image from 'next/image';
import React from 'react';

export default function CompareOnboard(props) {
  const getStarted = async () => {
    props.handleSuccess();
  };

  const handleBack = () => {
    props.backToMain();
  };

  return (
    <>
      <Row className="step fade-in" justify="space-between">
        <Col span={17} className="img-step">
          <Image className="img-gif" src="/image/onboarding/compare-step-1.gif" alt="" width={100} height={500} unoptimized />
        </Col>
        <Col span={6} className="step-desc">
          <div className="title">
            Compare Apps
            <span>
              Compare apps to get a comprehensive overview and find one that suits. See app ranking by category,
              detailed reviews, ranking change by time, and more.
            </span>
          </div>
          <div className="item-desc">
            {dataCompareApps.map((item, index) => (
              <Row key={item.app} className="step-feature">
                <Col span={2}>
                  <span>{index + 1}</span>
                </Col>
                <Col span={22}>
                  <div dangerouslySetInnerHTML={{ __html: item.app }} />
                </Col>
              </Row>
            ))}
            <div className="footer-onboard">
              <Button
                color="default"
                variant="outlined"
                className="skip-onboard button-onboard"
                onClick={handleBack}
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
