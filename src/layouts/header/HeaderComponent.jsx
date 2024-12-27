'use client';
import { Avatar, Badge, Button, Dropdown, Empty, Input, Layout, List, Menu, message, Popover, Tooltip } from 'antd';
import {
  BellOutlined,
  CaretDownOutlined,
  CloseOutlined,
  LoadingOutlined,
  MoreOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MENU_APPS_ITEM, MENU_RESOURCE_ITEM, MENU_TOP_APP_ITEM } from '@/constants/MenuItem';
import { debounce } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import Auth from '@/utils/store/Authentication';
import { getNoti, getReviewChanges } from '@/utils/functions';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import WatchAppChangeApiService from '@/api-services/api/WatchAppChangeApiService';
import './HeaderComponent.scss';
import { LayoutPaths, Paths } from '@/router';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import dynamic from 'next/dynamic';
import MyAppApiService from '@/api-services/api/MyAppApiService';

const TourGuide = dynamic(() => import('../main/tour-guide/TourGuide'), { ssr: false });

const { Header } = Layout;

const HeaderComponent = ({ myApps, menu, isShowProfile, selectedKeys, setSelectedKey }) => {
  const [listSearch, setListSearch] = useState();
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [isShowSearch, setIsShowSearch] = useState(false);
  const router = useRouter();
  const userName = Auth.getCurrentUser();
  const pathname = usePathname();
  const [currentKey, setCurrentKey] = useState(pathname);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isDropdownVisibleInsights, setIsDropdownVisibleInsights] = useState(false);
  const isAuthenticated = Auth.isAuthenticated();
  const [showOnboard, setShowOnboard] = useState(false);
  const [isDropdownControlledByTour, setIsDropdownControlledByTour] = useState(false);
  const [isDropdownControlledByTour1, setIsDropdownControlledByTour1] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const processNotifications = (notifications) => {
    return notifications.map((notification) => {
      let actionType = '';
      if (notification.notification.includes('revoked') || notification.notification.includes('deleted')) {
        actionType = 'delete';
      } else if (notification.notification.includes('granted') || notification.notification.includes('added')) {
        actionType = 'active';
      }

      return {
        ...notification,
        action_type: actionType,
      };
    });
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (Auth.isAuthenticated()) {
          const [data, unreadCount] = await Promise.all([
            MyAppApiService.getNotifications(),
            MyAppApiService.getCountNotifications(),
          ]);
          const processedNotifications = processNotifications(data.results);
          setNotifications(processedNotifications);
          setUnreadCount(unreadCount.results);
        }
      } catch (error) {
        console.error('Error when calling API to receive notification:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((notification) => !notification.is_read);
      const response = await MyAppApiService.getReadNotifications(unreadNotifications);

      if (response.code === 0) {
        const updatedNotifications = notifications.map((notification) => ({
          ...notification,
          is_read: true,
        }));
        setNotifications(updatedNotifications);
        setUnreadCount(0);
      } else {
        message.error('There was an error marking the notification as read.');
      }
    } catch (error) {
      message.error('There was an error marking all notifications as read.');
    }
  };

  const renderNotificationList = (
    <div style={{ width: '450px', maxHeight: '300px', overflowY: 'auto' }}>
      <List
        dataSource={notifications}
        renderItem={(item) => {
          let itemStyle = {};
          if (item.action_type === 'delete') {
            itemStyle = { backgroundColor: '#ffcccc' };
          } else if (item.action_type === 'active') {
            itemStyle = { backgroundColor: '#e6ffed' };
          }

          return (
            <List.Item style={{ ...itemStyle }}>
              <List.Item.Meta
                style={{ padding: '0px 5px' }}
                title={item.notification}
                description={`Created At: ${item.created_at}`}
              />
            </List.Item>
          );
        }}
      />
    </div>
  );

  useEffect(() => {
    const checkShowOnboard = async () => {
      if (Auth.getAccessToken()) {
        const response = await LandingPageApiService.handleShowOnboard();
        setShowOnboard(response.show_onboarding);
      }
    };
    checkShowOnboard();
  }, []);

  const handleSeeAllResults = (current) => {
    router.push(`/search?q=${encodeURIComponent(current)}`);
  };

  useEffect(() => {
    setCurrentKey(pathname);
  }, [pathname]);

  const onClickHomepage = () => {
    setSelectedKey(null);
  };

  const resourceSubmenu = (
    <Menu className="apps-dropdown">
      {MENU_RESOURCE_ITEM.map((item) => (
        <Menu.Item key={item.key} className={`${currentKey === item.linkTo ? 'active-item' : ''}`}>
          <Link prefetch={false} href={item.linkTo} onClick={() => handleClickMenuItem(item.linkTo)}>
            {item.title}
          </Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  const insightSubmenu = (
    <Menu className="apps-dropdown">
      <Menu.Item key="reviews" id="step3" className={`${currentKey === '/dashboard/reviews' ? 'active-item' : ''}`}>
        <Link prefetch={false} href="/dashboard/reviews" onClick={() => handleClickMenuItem('/dashboard/reviews')}>
          Reviews
        </Link>
      </Menu.Item>
      <Menu.Item key="developers" id="step2" className={`${currentKey === '/developers' ? 'active-item' : ''}`}>
        <Link prefetch={false} href="/developers" onClick={() => handleClickMenuItem('/developers')}>
          Developers
        </Link>
      </Menu.Item>
    </Menu>
  );

  const popupSubmenu = (
    <Menu className="apps-dropdown">
      {MENU_APPS_ITEM.map((item) => {
        return item.key === 'top-apps' ? (
          <Link key={item.key} href={item.linkTo}>
            <Menu.SubMenu title={item.title}>
              {MENU_TOP_APP_ITEM.map((subItem) => {
                return (
                  <Menu.Item key={subItem.key} className={`${currentKey === subItem.linkTo ? 'active-item' : ''}`}>
                    <Link prefetch={false} href={subItem.linkTo} onClick={() => handleClickMenuItem(subItem.linkTo)}>
                      {subItem.title}
                    </Link>
                  </Menu.Item>
                );
              })}
            </Menu.SubMenu>
          </Link>
        ) : (
          <Menu.Item key={item.key} className={`${currentKey === item.linkTo ? 'active-item' : ''}`}>
            <Link prefetch={false} href={item.linkTo} onClick={() => handleClickMenuItem(item.linkTo)}>
              {item.title}
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );

  const handleMenuItemClick = (e) => {
    e.domEvent.stopPropagation();
  };

  const handleClickMenuItem = (key) => {
    setCurrentKey(key);
  };

  const listAppsSearch = useMemo(() => {
    return listSearch ? (
      listSearch.length > 0 ? (
        <Menu>
          {listSearch.map((item) => {
            return (
              <Link prefetch={false} href={`/app/${item.value}`} key={item.value}>
                <Menu.Item>
                  <div>
                    {item.icon ? (
                      <Image src={item.icon} alt="icon" width={30} height={30} className="image" />
                    ) : (
                      <Image
                        src="/image/no-image.webp"
                        width={30}
                        height={30}
                        alt="No icon app"
                        className="image no-image"
                      />
                    )}
                    {item.text}
                  </div>
                </Menu.Item>
              </Link>
            );
          })}
        </Menu>
      ) : (
        <Menu>
          <Menu.Item>
            <i style={{ padding: '10px' }}>No Result</i>
          </Menu.Item>
        </Menu>
      )
    ) : (
      <></>
    );
  }, [listSearch]);

  const debouncedHandleInputChange = debounce(async (value) => {
    try {
      setLoadingSearch(true);
      const result = await SearchDataApiService.searchData(value, 1, 12);
      setLoadingSearch(false);
      if (result && result.code === 0) {
        setListSearch(
          result.data.apps.map((item) => {
            return {
              value: item.app_id,
              text: item.detail.name,
              icon: item.detail.app_icon,
            };
          }),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }, 500);

  const onSearchApps = async (current) => {
    debouncedHandleInputChange(current.target.value);
  };

  const handleLogin = () => {
    router.push(`${LayoutPaths.Auth}${Paths.LoginApp}`);
  };

  const handleRegister = () => {
    router.push(`${LayoutPaths.Auth}${Paths.Register}`);
  };

  const renderBgColor = (app) => {
    if (app.delete || app.unlisted) {
      return '#ffcccc';
    }
    return '';
  };

  const watchAppChange = async (id) => {
    await WatchAppChangeApiService.watchAppChange(id);
    router.push(`/app/${id}`);
    if (window.location.pathname.includes('/app')) {
      router.refresh();
    }
  };

  const popupMyApp = (
    <div className="scrollable-menu">
      {myApps && myApps.length > 0 ? (
        <Menu className="apps-dropdown">
          {myApps.map((item) => {
            return (
              <Menu.Item
                key={item.app_id}
                onClick={() => watchAppChange(item.app_id)}
                style={{ backgroundColor: renderBgColor(item.detail) }}
              >
                <Image
                  style={{ margin: '2px 5px 5px 0', borderRadius: '4px' }}
                  src={item.detail.app_icon}
                  alt=""
                  width={30}
                  height={30}
                />
                {item.detail.name}
                {item.detail.built_for_shopify === true && (
                  <>
                    <Tooltip title={item.detail && item.detail.rank_bfs > 0 ? item.detail.rank_bfs : ''}>
                      <Image src="/image/diamond.svg" alt="diamond" width={20} height={20} className="diamond-icon" />
                    </Tooltip>
                  </>
                )}
                {Object.keys(item.changed).length > 0 && item.changed.review_count && !item.watched_changes && (
                  <span className="review-change">
                    {getReviewChanges(item.changed.review_count.after, item.changed.review_count.before)}
                  </span>
                )}
                {getNoti(item)}
              </Menu.Item>
            );
          })}
        </Menu>
      ) : (
        <Menu className="apps-dropdown">
          <Empty
            image={Empty.PRESENTED_IMAGE_DEFAULT}
            imageStyle={{
              height: 60,
            }}
            description={
              <span style={{ fontSize: '15px' }}>
                <Link prefetch={false} href="/explore">
                  Search
                </Link>{' '}
                for applications that interest you
              </span>
            }
          />
        </Menu>
      )}
    </div>
  );

  const handleInsightsDropdownVisibleChange = (visible) => {
    if (!isDropdownControlledByTour) {
      setIsDropdownVisibleInsights(visible);
    }
  };

  const handleUserDropdownVisibleChange = (visible) => {
    if (!isDropdownControlledByTour1) {
      setIsDropdownVisible(visible);
    }
  };

  return (
    <>
      <Header className="sasi-layout-background">
        <div className="header-sasi container">
          <div className="menu-sasi">
            <div className="menu-content">
              <div className="logo-sasi">
                <Menu>
                  <Menu.Item key="homepage" onClick={onClickHomepage}>
                    <Link href={'/'}>
                      <Image
                        src="/image/logo_update.webp"
                        className="img-responsive"
                        alt="Logo"
                        width={75}
                        height={45}
                      />
                    </Link>
                  </Menu.Item>
                </Menu>
              </div>
              <div className="menu-right">
                <div className="list-menu">
                  <Menu mode="horizontal" defaultSelectedKeys={['4']} selectedKeys={[selectedKeys]}>
                    <Menu.Item key="apps" className="menu-item-detail">
                      <Dropdown placement="bottom" overlay={popupSubmenu} className="box-shadow" arrow>
                        <Link
                          href="/dashboard"
                          className={`menu-link  ${currentKey === '/dashboard' ? 'active' : ''}`}
                          onClick={() => handleClickMenuItem('/dashboard')}
                          id="step1"
                        >
                          Apps
                          <CaretDownOutlined style={{ marginLeft: '5px' }} />
                        </Link>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="compare-apps" className="menu-item-detail">
                      <Link
                        href="/#compare"
                        className={`menu-link  ${currentKey === '/#compare' ? 'active' : ''}`}
                        onClick={() => handleClickMenuItem('/#compare')}
                      >
                        Compare Apps
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="insights" className="menu-item-detail">
                      <Dropdown
                        placement="bottom"
                        overlay={insightSubmenu}
                        className="box-shadow"
                        arrow
                        visible={isDropdownVisibleInsights}
                        onVisibleChange={handleInsightsDropdownVisibleChange}
                      >
                        <span className={`menu-link  ${currentKey === '/developers' ? 'active' : ''}`}>
                          Insights
                          <CaretDownOutlined style={{ marginLeft: '5px' }} />
                        </span>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="resources" className="menu-item-detail">
                      <Dropdown placement="bottom" overlay={resourceSubmenu} className="box-shadow" arrow>
                        <span className={`menu-link ${currentKey === '/blogs' ? 'active' : ''}`}>
                          Resources
                          <CaretDownOutlined style={{ marginLeft: '5px' }} />
                        </span>
                      </Dropdown>
                    </Menu.Item>
                    <Menu.Item key="watching-apps" className="menu-item-detail">
                      <Link
                        href="/watching-apps"
                        className={`menu-link ${currentKey === '/watching-apps' ? 'active' : ''}`}
                        onClick={() => handleClickMenuItem('/watching-apps')}
                      >
                        Watching
                      </Link>
                    </Menu.Item>

                    {isAuthenticated && (
                      <Menu.Item key="my-apps" className="menu-item-detail">
                        <Dropdown placement="bottom" overlay={popupMyApp} arrow>
                          <span className="menu-link" id="step6">
                            My Apps
                          </span>
                        </Dropdown>
                      </Menu.Item>
                    )}

                    <Menu.Item key="search" onClick={handleMenuItemClick} className="menu-item-search">
                      {isShowSearch ? (
                        <Dropdown overlay={listAppsSearch} trigger={['click']} placement="bottom">
                          <Input
                            placeholder="Application name"
                            className="search-data"
                            onChange={onSearchApps}
                            onClick={(e) => e.stopPropagation()}
                            suffix={loadingSearch ? <LoadingOutlined /> : <></>}
                            onPressEnter={(e) => handleSeeAllResults(e.target.value)}
                          />
                        </Dropdown>
                      ) : (
                        <>
                          <SearchOutlined
                            className="search-icon"
                            onClick={(e) => {
                              setIsShowSearch(true);
                              e.stopPropagation();
                            }}
                          />
                          <div
                            className="search-text"
                            onClick={(e) => {
                              setIsShowSearch(true);
                              e.stopPropagation();
                            }}
                          >
                            Search
                          </div>
                        </>
                      )}
                      {isShowSearch && <CloseOutlined className="close-icon" onClick={() => setIsShowSearch(false)} />}
                    </Menu.Item>
                  </Menu>
                </div>
              </div>
            </div>
            {isShowProfile ? (
              <div className="header-profile flex items-center">
                <Popover
                  className="notification-account"
                  content={renderNotificationList}
                  title="Notification"
                  trigger="click"
                  placement="bottomRight"
                  onClick={markAllAsRead}
                >
                  <Badge count={unreadCount} showZero>
                    <BellOutlined />
                  </Badge>
                </Popover>
                <Dropdown
                  overlay={menu}
                  trigger={['hover']}
                  visible={isDropdownVisible}
                  onVisibleChange={handleUserDropdownVisibleChange}
                >
                  <Tooltip title={userName ? userName : ''} className="flex items-center" placement="right">
                    <Avatar className="avatar-profile-header" style={{ backgroundColor: '#FFC225' }}>
                      {userName ? userName.substring(0, 1).toLocaleUpperCase() : ''}
                    </Avatar>
                    <MoreOutlined />
                  </Tooltip>
                </Dropdown>
              </div>
            ) : (
              <div className="register-login">
                <div className="button-register">
                  <Button className="button-register-styled" size={'medium'} onClick={handleRegister}>
                    Get Started
                  </Button>
                </div>
                <div className="button-login">
                  <Button className="button-login-styled" size={'medium'} onClick={handleLogin}>
                    Login
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Header>

      {showOnboard && (
        <TourGuide
          setIsDropdownVisible={setIsDropdownVisible}
          setIsDropdownVisibleInsights={setIsDropdownVisibleInsights}
          setIsDropdownControlledByTour={setIsDropdownControlledByTour}
          setIsDropdownControlledByTour1={setIsDropdownControlledByTour1}
          handleSuccess={() => setShowOnboard(false)}
        />
      )}
    </>
  );
};

export default HeaderComponent;
