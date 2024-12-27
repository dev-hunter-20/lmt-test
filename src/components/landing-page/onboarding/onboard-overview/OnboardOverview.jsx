'use client';

import React, { useMemo, useState } from 'react';
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import Image from 'next/image';
import { dataDashboard } from '@/utils/data/onboarding';

const DotIndicator = ({ currentStep }) => {
  const steps = ['app-dashboard-step-1', 'app-dashboard-step-2', 'app-dashboard-step-3'];

  return (
    <Row justify="center" className="dots">
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            backgroundColor: currentStep === step ? 'orange' : '#e0e0e0',
            margin: '0 5px',
          }}
        />
      ))}
    </Row>
  );
};

export default function OnboardOverview({ type, backToMain }) {
  const [currentStep, setCurrentStep] = useState(type);

  const getStarted = () => backToMain();

  const handleAction = (isBack) => {
    switch (currentStep) {
      case 'app-dashboard-step-2':
        setCurrentStep(isBack ? 'app-dashboard-step-1' : 'app-dashboard-step-3');
        break;
      case 'app-dashboard-step-3':
        if (isBack) {
          setCurrentStep('app-dashboard-step-2');
        } else {
          backToMain();
        }
        break;
      default:
        setCurrentStep(isBack ? backToMain() : 'app-dashboard-step-2');
    }
  };

  const renderDashboardStep = (step, title, desc, keyField) => (
    <>
      <Col span={17} className="img-step">
        <Image className="img-gif" src={`/image/onboarding/${step}.gif`} alt="" width={100} height={500} unoptimized />
      </Col>
      <Col span={6} className="step-desc">
        <div className="title">
          {title}
          <span>{desc}</span>
        </div>
        <div className="item-desc">
          {dataDashboard.map((item, index) => (
            <Row className="step-feature" key={item.app}>
              <Col span={2}>
                <span>{index + 1}</span>
              </Col>
              <Col span={22}>
                <div dangerouslySetInnerHTML={{ __html: item[keyField] }} />
              </Col>
            </Row>
          ))}
          <div className="footer-onboard">
            <Button
              color="default"
              variant="outlined"
              className="skip-onboard button-onboard"
              onClick={() => handleAction(true)}
              size="large"
            >
              Back
            </Button>
            {currentStep !== 'app-dashboard-step-3' ? (
              <Button type="primary" size="large" onClick={() => handleAction()} className="button-onboard">
                Next <RightOutlined />
              </Button>
            ) : (
              <Button type="primary" size="large" onClick={getStarted} className="button-onboard">
                Done <CheckOutlined />
              </Button>
            )}
          </div>
        </div>
      </Col>
    </>
  );

  const renderDashboard = useMemo(() => {
    switch (currentStep) {
      case 'app-dashboard-step-1':
        return renderDashboardStep(
          'overview-step-1',
          'Explore Application Dashboard',
          'Gain insights into the performance of Shopify apps over a specific time period.',
          'app',
        );
      case 'app-dashboard-step-2':
        return renderDashboardStep(
          'overview-step-2',
          'Explore Application Dashboard',
          'Obtain an overview of developer performance, comparing active versus inactive developers.',
          'developer',
        );
      case 'app-dashboard-step-3':
      default:
        return renderDashboardStep(
          'overview-step-3',
          'Explore Application Dashboard',
          'Gain insights from reviews by location, competitors, category, and even those that have been deleted.',
          'review',
        );
    }
  }, [currentStep]);

  return (
    <>
      <Row className="step fade-in" justify="space-between">
        {renderDashboard}
      </Row>
      <DotIndicator currentStep={currentStep} />
    </>
  );
}
