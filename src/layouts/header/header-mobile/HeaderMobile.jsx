'use client';

import { MENU_APP_ITEM, MENU_ITEMS, MENU_TOP_APP_ITEM } from '@/constants/MenuItem';
import Auth from '@/utils/store/Authentication';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Dropdown, Input } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import './HeaderMobile.scss';
import SearchIcon from '@/components/ui/icon/SearchIcon';
import { LayoutPaths, Paths } from '@/router';

const { Search } = Input;

const HeaderMobile = ({ onSearch, isShowProfile, myApps, menu }) => {
  const [active, setActive] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(false);
  const [activeMenu, setActiveMenu] = useState(false);
  const [activeTopApp, setActiveTopApp] = useState(false);

  const handlerClick = () => {
    setActive(!active);
  };

  const handlerClickDropdown = (item) => {
    if (item.hasSub) {
      item.key === 'apps' ? setActiveMenu(!activeMenu) : setActiveTopApp(!activeTopApp);
      return;
    }
    if (item.isCheckAuth) {
      setActiveDropdown(!activeDropdown);
    }
  };

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (item.isCheckAuth) {
      return Auth.isAuthenticated();
    }
    return true;
  });

  return (
    <div className="Header-mobile">
      <div className="Header-mobile-logo">
        <Link prefetch={false} href="/">
          <Image src="/image/logo_update.webp" alt="Logo" width={80} height={60} />
        </Link>
      </div>
      <div className="Header-mobile-bottom">
        <div className="Header-mobile-bottom-bars" onClick={handlerClick}>
          <SearchIcon />
        </div>
        <div className="Header-mobile-search">
          <Search placeholder="Search for apps and developer" onSearch={onSearch} />
        </div>
        <div className="Header-mobile-login">
          {isShowProfile ? (
            <div className="header-profile">
              <Dropdown overlay={menu} trigger={['click']}>
                <div className="profile-header">
                  <Avatar
                    className="avatar-profile-header"
                    style={{ backgroundColor: '#FFC225' }}
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
              <div className="model-connect-shopify"></div>
            </div>
          ) : (
            <div className="button-login">
              <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`} className="link-login_app">
                Login
              </Link>
            </div>
          )}
        </div>
        <ul className={`Header-mobile-list ${active ? 'active' : ''}`}>
          {filteredMenuItems.map((item, index) => (
            <li
              key={item.key}
              className={`${item.isCheckAuth || item.hasSub ? 'has-sub-menu' : ''}`}
              onClick={() => handlerClickDropdown(item)}
            >
              {item.isCheckAuth && Auth.isAuthenticated() && item.isShowPopupMyApp ? (
                <Link prefetch={false} href="#javascript">
                  {item.nameShow}
                </Link>
              ) : (
                <Link prefetch={false} href={item.hasSub ? '#javascript' : item.linkTo || '#'}>
                  {item.title}
                </Link>
              )}
              {item.hasSub && item.key === 'apps' ? (
                <ul className={`dropdownMenu ${activeMenu ? 'active' : ''}`}>
                  {MENU_APP_ITEM.map((item) => (
                    <li key={item.key}>
                      <Link prefetch={false} href={item.linkTo || '#'}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
              {item.hasSub && item.key !== 'apps' ? (
                <ul className={`dropdownMenu ${activeTopApp ? 'active' : ''}`}>
                  {MENU_TOP_APP_ITEM.map((item) => (
                    <li key={item.key}>
                      <Link prefetch={false} href={item.linkTo || '#'}>
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                ''
              )}
              {item.isCheckAuth && Auth.isAuthenticated() && item.isShowPopupMyApp ? (
                <ul className={`dropdownMenu ${activeDropdown ? 'active' : ''}`}>
                  {myApps &&
                    myApps.map((item, index) => (
                      <li key={index}>
                        <Link prefetch={false} href={'/app/' + item.app_id}>
                          {item.detail && item.detail.name ? item.detail.name : ''}
                        </Link>
                      </li>
                    ))}
                </ul>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeaderMobile;
