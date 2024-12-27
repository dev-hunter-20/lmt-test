'use client';
import { Layout, Menu } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  AppstoreOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LogoutOutlined,
  ReadOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import Auth from '@/utils/store/Authentication';
import Container from '../container/Container';
import FooterSasi from '../footer/FooterSasi';
import './NavbarPage.scss';
import { useDispatch, useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import HeaderComponent from '../header/HeaderComponent';
import HeaderMobile from '../header/header-mobile/HeaderMobile';
import { getListMyApps } from '@/redux/slice/my-apps/MyApps';
import { logout } from '@/redux/slice/auth/LoginApp';
import { LayoutPaths, Paths } from '@/router';
import { hideOnboarding, showOnboarding } from '@/redux/slice/onboarding/OnboadingState';

const Onboarding = dynamic(() => import('@/components/landing-page/onboarding/Onboarding'), { ssr: false });

const NavbarPage = ({ children }) => {
  const router = useRouter();
  const [isShowProfile, setIsShowProfile] = useState(Auth.isAuthenticated());
  const CMS_URL = process.env.NEXT_PUBLIC_REACT_APP_CMS_URL ?? 'https://cms.letsmetrix.com';
  const accessToken = Auth.getAccessToken();
  const [selectedKey, setSelectedKey] = useState(null);
  const [isCheck, setIsCheck] = useState(false);
  const [isSize, setIsSize] = useState(false);
  const myApps = useSelector((state) => state.myApps.listMyApps);
  const dispatch = useDispatch();
  const isShowOnboarding = useSelector((state) => state.onboardingState.isShowOnboardingState);

  const handleOnboarding = () => {
    dispatch(showOnboarding());
  };

  const handleCloseOnboarding = () => {
    dispatch(hideOnboarding());
  };

  const getMyApps = useCallback(() => {
    setSelectedKey(null);
    if (Auth.isAuthenticated()) {
      dispatch(getListMyApps());
    }
  }, [dispatch]);

  useEffect(() => {
    setIsCheck(true);
    getMyApps();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSize(window.innerWidth <= 1275);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onSearch = (value) => {
    const query = { q: value };
    const queryString = new URLSearchParams(query).toString();
    router.push(`/search?${queryString}`);
  };

  const handleChangePass = () => {
    router.push(`${LayoutPaths.Auth}${Paths.ResetPassword}`);
  };

  const handleLogout = () => {
    setIsShowProfile(false);
    dispatch(logout());
    Auth.logout();
    router.push('/');
  };

  const appListSaved = JSON.parse(localStorage.getItem('COMPARISON_LISTS')) || [];

  const menu = (
    <Menu className="apps-dropdown">
      {Auth.isAuthenticated() && (
        <Menu.Item key="cms" icon={<AppstoreOutlined />} id="step4">
          <Link prefetch={false} target="_blank" href={`${CMS_URL}/login?accessToken=` + accessToken}>
            Cms
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="changePass" onClick={handleChangePass} icon={<EditOutlined />}>
        Change password
      </Menu.Item>
      {appListSaved.length > 0 && (
        <Menu.Item key="compared" icon={<SwapOutlined />}>
          <Link prefetch={false} href="/compared-apps-list">
            Comparison app list
          </Link>
        </Menu.Item>
      )}
      <Menu.Item key="onboarding" onClick={handleOnboarding} icon={<ReadOutlined />} id="step8">
        Getting started guide
      </Menu.Item>
      <Menu.Item key="help" icon={<InfoCircleOutlined />}>
        <Link prefetch={false} target="_blank" rel="noopener noreferrer" href="https://docs.letsmetrix.com/">
          Help
        </Link>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout} icon={<LogoutOutlined />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Layout className="sasi-layout">
        {isCheck && (
          <>
            {!isSize ? (
              <HeaderComponent
                myApps={myApps}
                menu={menu}
                isShowProfile={isShowProfile}
                selectedKeys={selectedKey}
                setSelectedKey={setSelectedKey}
              />
            ) : (
              <HeaderMobile onSearch={onSearch} menu={menu} isShowProfile={isShowProfile} myApps={myApps} />
            )}
            <Container>{children}</Container>
            <FooterSasi />
            {isShowOnboarding && <Onboarding handleSuccess={handleCloseOnboarding} />}
          </>
        )}
      </Layout>
    </>
  );
};

export default NavbarPage;
