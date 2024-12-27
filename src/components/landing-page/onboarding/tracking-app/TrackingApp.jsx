'use client';

import React, { useMemo, useState } from 'react';
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import Image from 'next/image';
import { dataTracking } from '@/utils/data/onboarding';

const DotIndicator = ({ currentStep }) => {
  const steps = [
    'track-app-search-step-1',
    'track-app-search-step-2',
    'track-app-search-step-3',
    'track-app-search-step-4',
  ];

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

export default function TrackingApp({ type, backToMain }) {
  const [currentStep, setCurrentStep] = useState(type);

  const getStarted = async () => {
    backToMain();
  };

  const handleAction = (isBack) => {
    const stepMap = {
      'track-app-search-step-1': isBack ? backToMain : () => setCurrentStep('track-app-search-step-2'),
      'track-app-search-step-2': () => setCurrentStep(isBack ? 'track-app-search-step-1' : 'track-app-search-step-3'),
      'track-app-search-step-3': () => setCurrentStep(isBack ? 'track-app-search-step-2' : 'track-app-search-step-4'),
      'track-app-search-step-4': isBack ? () => setCurrentStep('track-app-search-step-3') : getStarted,
    };
    stepMap[currentStep]?.();
  };

  const renderStepContent = (step, title, desc, keyField) => (
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
          {dataTracking.map((item, index) => (
            <Row className="step-feature" key={index}>
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
            {currentStep !== 'track-app-search-step-4' ? (
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

  const renderTrackingSteps = useMemo(() => {
    switch (currentStep) {
      case 'track-app-search-step-1':
        return renderStepContent(
          'track-step-1',
          'Application search',
          'Quickly find and access applications by entering their name or relevant keywords in the search bar',
          'search',
          'search-app',
        );
      case 'track-app-search-step-2':
        return renderStepContent(
          'track-step-2',
          'Add your app',
          "Get valuable insights into keyword ranking, merchant growth, earnings, and churn, helping you make informed decisions to enhance your app's performance and profitability.",
          'addApp',
          'add-your-app',
        );
      case 'track-app-search-step-3':
        return renderStepContent(
          'track-step-3',
          'Add Keywords',
          'Track keyword performance to identify which keywords drive earnings and optimize your app listing content accordingly',
          'addKeyword',
          'add-keyword',
        );
      case 'track-app-search-step-4':
      default:
        return renderStepContent(
          'track-step-4',
          'Track competitor apps',
          '* For apps successfully connected to Google Analytics',
          'addCompare',
          'compare',
        );
    }
  }, [currentStep]);

  return (
    <>
      <Row className="step fade-in" justify="space-between">
        {renderTrackingSteps}
      </Row>
      <DotIndicator currentStep={currentStep} />
    </>
  );
}
