'use client';

import { dataOnboardingSteps } from '@/utils/data/onboarding';
import { Modal, Row } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';
import './Onboarding.scss';
import OnboardOverview from './onboard-overview/OnboardOverview';
import DataManage from './data-manage/DataManage';
import TrackingApp from './tracking-app/TrackingApp';
import CompareOnboard from './compare-app/CompareOnboard';

export default function Onboarding(props) {
  const [type, setType] = useState('');

  const viewActionDetail = (url) => {
    setType(url);
  };

  const openChat = () => {
    window.$crisp.push(['do', 'chat:open']);
  };

  const backToMain = () => {
    setType('');
  };

  const skip = async () => {
    props.handleSuccess();
  };

  const renderAction = (url) => {
    switch (url) {
      case 'app-dashboard-step-1':
        return <OnboardOverview type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      case 'data-manage-access-step-1':
        return <DataManage type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      case 'track-app-search-step-1':
        return <TrackingApp type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      case 'compare-app-step-1':
        return <CompareOnboard type={type} backToMain={backToMain} handleSuccess={props.handleSuccess} />;
      default:
        return (
          <>
            <Row justify="center" className="top-onboarding">
              <Image src={'/image/logo_lmt.webp'} alt="logo-lmt" width={100} height={100} />
              <div className="onboarding-new-title">
                <span className="title">Better app strategy with insightful data</span>
                <span className="desc">Easy steps to start with Let’s Metrix</span>
              </div>
            </Row>
            <Row className="onboarding-new-desc" justify="center"></Row>
            <Row justify="center" className="item-onboarding">
              {dataOnboardingSteps.map((item, index) => (
                <div key={index} className="onboarding-new-action" onClick={() => viewActionDetail(item.url)}>
                  <div className="onboarding-new-action-image">
                    <Image src={item.image} alt="logo-item-onboarding" className="img" width={80} height={80} />
                  </div>
                  <div className="onboarding-new-action-title">{item.title}</div>
                </div>
              ))}
            </Row>
            <Row justify="center">
              <div className="onboarding-new-help">
                Need help getting started? <a onClick={openChat}>Contact us</a>
              </div>
            </Row>
          </>
        );
    }
  };

  return (
    <Modal open={true} className="onboarding-new" footer={null} width={'80%'} onCancel={skip}>
      {renderAction(type)}
    </Modal>
  );
}
