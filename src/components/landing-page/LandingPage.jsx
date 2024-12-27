'use client';

import { ArrowRightOutlined, SearchOutlined, StarFilled } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Col,
  Divider,
  Empty,
  Input,
  Progress,
  Row,
  Spin,
  Tooltip,
  TreeSelect,
  Typography,
} from 'antd';
import './LandingPage.scss';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useCallback, useEffect, useMemo, useState } from 'react';
import FadeInSection from './fade-in-section/FadeInSection';
import TableApp from './table-app/TableApp';
import Link from 'next/link';
import { COLUMNS } from '@/constants/MenuItem';
import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import Auth from '@/utils/store/Authentication';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQuery } from '@tanstack/react-query';
import SearchDataApiService from '@/api-services/api/SearchDataApiService';
import { debounce } from 'lodash';
import CompareApp from './compare-app/CompareApp';
import { LayoutPaths, Paths } from '@/router';
import { showOnboarding } from '@/redux/slice/onboarding/OnboadingState';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOnboardStatus } from '@/redux/slice/onboarding/Onboading';

dayjs.extend(relativeTime);

const LandingPage = () => {
  const router = useRouter();
  const [valueFilter, setValueFilter] = useState('finding-products');
  const [queryKey, setQueryKey] = useState(['filterByCat', valueFilter]);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const dispatch = useDispatch();
  const isShowOnboarding = useSelector((state) => state.onboarding.isShowOnboarding);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.includes('#compare')) {
        const element = document.getElementById('compare');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
          setTimeout(() => {
            window.scrollBy(0, 700);
          }, 500);
        }
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSeeAllResults = (searchValue) => {
    router.push(`/search?q=${encodeURIComponent(searchValue)}`);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value) => {
        if (!value) return;
        setSearchLoading(true);
        try {
          const response = await SearchDataApiService.searchData(value, 1, 15);
          const apps = response.data.apps;

          if (apps.length === 0) {
            setSearchResults([
              {
                value: 'no-results',
                label: <Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description="No results found" />,
              },
            ]);
          } else {
            const results = apps.map((app) => ({
              value: app.detail.app_id,
              label: (
                <div key={app.detail.app_id}>
                  {app.detail && app.detail.app_icon ? (
                    <Image src={app.detail.app_icon} alt={app.detail.name} width={35} height={35} />
                  ) : (
                    <Image src={'/image/no-image.webp'} alt={'no image'} width={35} height={35} className="no-image" />
                  )}
                  &nbsp;
                  <span>{app.detail.name}</span>
                </div>
              ),
            }));
            results.push({
              value: 'see-all',
              label: (
                <div key="see-all" style={{ textAlign: 'center' }}>
                  <Button
                    type="link"
                    icon={<ArrowRightOutlined />}
                    onClick={() => handleSeeAllResults(value)}
                    className="btn-see_all"
                  >
                    See All Results
                  </Button>
                </div>
              ),
            });
            setSearchResults(results);
          }
        } catch (error) {
          console.error('Failed to fetch search results:', error);
        } finally {
          setSearchLoading(false);
        }
      }, 300),
    [],
  );

  const onSearchApp = useCallback(
    (value) => {
      setSearchLoading(true);
      debouncedSearch(value);
    },
    [debouncedSearch],
  );

  const handleSelect = (value) => {
    if (value === 'see-all') {
      const searchInput = document.querySelector('.input-style input');
      if (searchInput) {
        const searchValue = searchInput.value;
        router.push(`/search?q=${encodeURIComponent(searchValue)}`);
      }
    } else if (value !== 'see-all') {
      router.push(`/app/${value}`);
    } else if (value === 'no-results') {
      return;
    }
  };

  const handleSignUp = () => {
    if (Auth.getAccessToken()) {
      router.push('/pricing');
      return;
    }
    router.push(`${LayoutPaths.Auth}${Paths.Register}`);
  };

  const dataCategory = (allCategory) => {
    if (allCategory) {
      return allCategory.map((item) => {
        return {
          value: item.slug,
          title: item.text,
          children: dataCategory(item.child),
        };
      });
    }
  };

  useEffect(() => {
    if (Auth.getAccessToken()) {
      dispatch(fetchOnboardStatus());
    }
  }, [dispatch]);

  const fetchDetailApp = async () => {
    const [top5Apps, dataCategoryPos, dataTopMover, dataTopReview, dataTopRelease, count] = await Promise.all([
      LandingPageApiService.getTop5Apps('finding-products'),
      LandingPageApiService.getCategoriesHome('uk'),
      LandingPageApiService.getGrowthRateApps(1, 3),
      LandingPageApiService.getTopReviewHome(1, 3),
      LandingPageApiService.getTopReleaseHome(1, 9),
      LandingPageApiService.getCount(),
    ]);
    const categories = dataCategory(dataCategoryPos?.category);
    const topApp = {
      topMovers: dataTopMover?.data,
      topReviews: dataTopReview?.result,
      topRelease: dataTopRelease?.top_release,
    };
    const top5App = top5Apps?.data?.apps ? top5Apps.data.apps.sort((a, b) => a.star - b.star) : [];
    return {
      categories,
      topApp,
      count,
      top5App,
    };
  };

  const { data, isLoading } = useQuery({
    queryKey: ['fetchDetailApp'],
    queryFn: fetchDetailApp,
  });

  const filterByCat = async (id) => {
    const top5Apps = await LandingPageApiService.getTop5Apps(id);
    return top5Apps.data.apps.sort((a, b) => a.star - b.star);
  };

  const { data: top5Apps } = useQuery({
    queryKey: queryKey,
    queryFn: () => filterByCat(valueFilter),
    enabled: !!valueFilter,
  });

  const onChangeFilter = (value) => {
    setValueFilter(value);
    setQueryKey(['filterByCat', value]);
  };

  const renderDataSource = (data) => {
    if (data) {
      return data.map((item) => {
        return {
          key: item.detail.app_id,
          app: {
            img: item.detail.app_icon,
            name: item.detail.name || ' ',
            desc: item.detail.metatitle || ' ',
            slug: item.detail.app_id,
          },
          diffRank:
            item.count ||
            item.review_count ||
            item.detail.review_count ||
            (item.detail.launched ? dayjs(item.detail.launched).fromNow() : ' '),
        };
      });
    }
    return [];
  };

  const handleOnboarding = () => {
    dispatch(showOnboarding());
  };

  return (
    <>
      <div className="layout-landing-page">
        <div className="layout-landing-page-intro">
          <div className="container">
            <Row type="flex" style={{ alignItems: 'center' }}>
              <Col lg={12} span={24}>
                <h1 className="title">All you need to win Shopify Apps market</h1>
                <h2 className="description">Insights and data across thousands Shopify Apps</h2>
                <div className="input" id="step5">
                  <AutoComplete
                    options={searchResults}
                    onSearch={onSearchApp}
                    onSelect={handleSelect}
                    notFoundContent={
                      searchLoading ? <Spin size="small" style={{ display: 'flex', justifyContent: 'center' }} /> : null
                    }
                    style={{ width: '100%' }}
                    popupMatchSelectWidth={false}
                  >
                    <Input
                      className="input-style"
                      size="large"
                      placeholder="Find an app by name, categories and more"
                      prefix={<SearchOutlined />}
                      onPressEnter={(e) => handleSeeAllResults(e.target.value)}
                    />
                  </AutoComplete>
                </div>
                <div className="divider">
                  <Divider />
                </div>
                <h2 className="description">Want a deeper insights?</h2>
                <div className="cta-btn">
                  <Button className="wrapper__button" onClick={handleSignUp}>
                    Start your free trial
                  </Button>
                </div>
              </Col>
              <Col lg={12} span={24} className="flex flex-col items-center">
                {top5Apps ? (
                  <div
                    className={`progress flex ${top5Apps ? 'flex-col justify-between' : 'justify-center items-center'}`}
                  >
                    {top5Apps ? (
                      top5Apps.map((item, index) => {
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <Progress
                              className={`progress-${index}`}
                              percent={60}
                              showInfo={false}
                              strokeColor={{
                                '0%': 'rgba(182, 131, 0, 1)',
                                '100%': 'rgba(255, 194, 37, 1)',
                              }}
                            />

                            <Tooltip title={item.name}>
                              <Typography.Text ellipsis={1} className="progress-name">
                                {item.name} <br /> {item.star} <StarFilled style={{ color: 'yellow' }} />
                              </Typography.Text>
                            </Tooltip>
                            <Link prefetch={false} href={`/app/${item.id}`}>
                              <Image
                                className="progress-image"
                                src={item.app_icon}
                                alt="logoo"
                                width={48}
                                height={48}
                              />
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <Spin size="large" />
                    )}
                  </div>
                ) : (
                  <div
                    className={`progress flex ${
                      data?.top5App ? 'flex-col justify-between' : 'justify-center items-center'
                    }`}
                  >
                    {data?.top5App ? (
                      data?.top5App.map((item, index) => {
                        return (
                          <div key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                            <Progress
                              className={`progress-${index}`}
                              percent={60}
                              showInfo={false}
                              strokeColor={{
                                '0%': 'rgba(182, 131, 0, 1)',
                                '100%': 'rgba(255, 194, 37, 1)',
                              }}
                            />

                            <Tooltip title={item.name}>
                              <Typography.Text ellipsis={1} className="progress-name">
                                {item.name} <br /> {item.star} <StarFilled style={{ color: 'yellow' }} />
                              </Typography.Text>
                            </Tooltip>
                            <Link prefetch={false} href={`/app/${item.id}`}>
                              <Image
                                className="progress-image"
                                src={item.app_icon}
                                alt="logoo"
                                width={48}
                                height={48}
                                priority
                              />
                            </Link>
                          </div>
                        );
                      })
                    ) : (
                      <Spin size="large" />
                    )}
                  </div>
                )}

                {data?.categories ? (
                  <div className="sort-by">
                    <TreeSelect
                      showSearch
                      value={valueFilter}
                      placeholder="Please select"
                      onChange={onChangeFilter}
                      treeData={data?.categories}
                      virtual={false}
                      loading={isLoading}
                    />
                  </div>
                ) : (
                  <div className="sort-by">
                    <TreeSelect
                      showSearch
                      value={valueFilter}
                      placeholder="Please select"
                      onChange={onChangeFilter}
                      treeData={''}
                      virtual={false}
                      loading={isLoading}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </div>
        </div>

        <div className="layout-landing-page-param">
          <Row className="detail" justify={'center'}>
            <Col lg={16} sm={18} xs={22}>
              <FadeInSection>
                <Row>
                  <Link
                    prefetch={false}
                    href={'/dashboard'}
                    className="primary-color"
                    style={{ fontWeight: 500, textDecoration: 'underline' }}
                  >
                    Explore what you can get <ArrowRightOutlined className="primary-color" />
                  </Link>
                </Row>
                {data?.count && (
                  <Row justify={'space-between'}>
                    {[
                      {
                        title: 'Apps',
                        value: data?.count.app_count,
                        href: '/dashboard',
                      },
                      {
                        title: 'Reviews',
                        value: data?.count.review_count,
                        href: '/dashboard/reviews',
                      },
                      {
                        title: 'Categories',
                        value: data?.count.category_count,
                        href: '/categories',
                      },
                      {
                        title: 'Developers',
                        value: data?.count.partner_count,
                        href: '/developers',
                      },
                    ].map((item, index) => (
                      <Link key={index} prefetch={false} href={item.href}>
                        <Col className="detail__box">
                          <Row>
                            <Typography.Text className="total-title" level={1}>
                              {item?.value?.toLocaleString('en-US') ?? ''}
                            </Typography.Text>
                          </Row>
                          <Row>
                            <Typography.Text className="total-desc">{item.title}</Typography.Text>
                          </Row>
                        </Col>
                      </Link>
                    ))}
                  </Row>
                )}
              </FadeInSection>
            </Col>
          </Row>
          <Row className="dashboard-explore" justify={'center'}>
            <Col lg={12} sm={18} xs={22}>
              <FadeInSection>
                <Row className="text-merket">
                  <Typography.Text className="dashboard-explore_text-understand primary-color">
                    Understand what rules the market
                  </Typography.Text>
                </Row>
                <Row className="text-merket_content">
                  <Typography.Text className="dashboard-explore_text">
                    Let’s Metrix helps marketers, developers and product managers to understand insights and data across
                    thousands Shopify Apps
                  </Typography.Text>
                </Row>
                {data?.count && (
                  <Row justify={'space-between'}>
                    {[
                      {
                        image: '/image/optimize.png',
                        title: 'Optimize ASO & User Insights',
                        value:
                          'Access unlimited keyword analytics powered by AI and user insights to boost app visibility and optimize user experience',
                      },
                      {
                        image: '/image/revenue.png',
                        title: 'Revenue & Growth Tracking',
                        value:
                          'Monitor revenue, retention rate, churn rate and subscriptions to optimize financial performance and business strategies.',
                      },
                      {
                        image: '/image/changelog.png',
                        title: 'Competitor Changelog Analysis',
                        value:
                          'Track competitor changes, rankings, and reviews to gain insights and stay ahead in the market.',
                      },
                      {
                        image: '/image/comparison.png',
                        title: 'DeveApp Comparisonlopers',
                        value:
                          'Compare unlimited apps, diverse filters, category rankings, reviews, and ranking changes over time. ',
                      },
                    ].map((item, index) => (
                      <Col key={index} className="dashboard-explore_box">
                        <Row>
                          <Image src={item.image} width={48} height={48} alt="icon" />
                        </Row>
                        <Row className="total-title">
                          <Typography.Text level={3}>{item.title}</Typography.Text>
                        </Row>
                        <Row>
                          <Typography.Text className="total-desc">{item.value}</Typography.Text>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                )}
              </FadeInSection>
            </Col>
          </Row>
        </div>

        <div className="layout-landing-page-unlock">
          <FadeInSection>
            <Row className="dashboard-explore" justify={'center'}>
              <Col lg={14} sm={18} xs={22}>
                <FadeInSection>
                  <Row className="text-merket">
                    <Typography.Text className="dashboard-explore_text-understand primary-color">
                      How to use Letsmetrix
                    </Typography.Text>
                  </Row>
                  <Row className="text-merket">
                    <Typography.Text className="dashboard-explore_text">
                      Unlock the full potential of Letsmetrix in 3 simple steps
                    </Typography.Text>
                  </Row>
                  {data?.count && (
                    <Row justify={'space-between'}>
                      {[
                        {
                          image: '/image/user-orange.png',
                          title: 'Step 1',
                          value: 'Create a free account',
                          width: 35,
                          height: 35,
                        },
                        {
                          image: '/image/shopify-logo.png',
                          title: 'Step 2',
                          value: 'Connect Shopify API',
                          width: 45,
                          height: 45,
                        },
                        {
                          image: '/image/GAnalytics.png',
                          title: 'Step 3',
                          value: 'Sync GA with Letsmetrix',
                          width: 35,
                          height: 33,
                        },
                      ].map((item, index) => (
                        <Col key={index} className="dashboard-explore_box">
                          <Row>
                            <Image src={item.image} width={item.width} height={item.height} alt="icon" />
                          </Row>
                          <Row className="total-title">
                            <Typography.Text level={3}>{item.title}</Typography.Text>
                          </Row>
                          <Row>
                            <Typography.Text className="total-desc">{item.value}</Typography.Text>
                          </Row>
                        </Col>
                      ))}
                    </Row>
                  )}
                  <Row justify={'center'}>
                    <Button onClick={handleOnboarding} className="wrapper__button mt-30" type="primary">
                      Get started guided
                    </Button>
                  </Row>
                </FadeInSection>
              </Col>
            </Row>
          </FadeInSection>
        </div>

        <div className="layout-landing-page-unlock_insights">
          <FadeInSection>
            <Row className="dashboard-explore" justify={'center'}>
              <Col lg={15} sm={18} xs={22}>
                <FadeInSection>
                  <Row className="text-merket">
                    <Typography.Text className="dashboard-explore_text-understand primary-color">
                      Unlock Insights with a visual Dashboard
                    </Typography.Text>
                  </Row>
                  <Row className="text-merket">
                    <Typography.Text className="dashboard-explore_text">
                      Easily access and analyze key data through our intuitive, user-friendly dashboard for better
                      decision-making and optimized performance.
                    </Typography.Text>
                  </Row>
                  {data?.count && (
                    <Row justify={'space-between'}>
                      {[
                        {
                          image: '/image/keyword-analytics.png',
                          title: 'Keywords Analysis',
                          value: '10+ Attribution with:',
                          cotent: [
                            "Manual Keywords – Optimize your app's visibility using custom keywords.",
                            'Suggested Keywords – Leverage expert recommendations for improved reach.',
                            'AI-Generated Keywords – Enhance your strategy with AI-driven.',
                          ],
                        },
                        {
                          image: '/image/merchant-analytics.png',
                          title: 'Merchant Analytics',
                          value: 'Optimize app performance and business strategies',
                          cotent: [
                            'User growth and earning',
                            'Churn & Reinstall',
                            'Customer Lifecycle / Conversation rate',
                            'App position',
                            'Review & Ratings',
                            'Change log tracking',
                            'User acquisition',
                            'Traffic attribution',
                          ],
                        },
                        {
                          image: '/image/compaetitor-research.gif',
                          title: 'Competitor Research',
                          value:
                            'Conduct competitor research with Letsmetrix’s user-friendly and detailed app comparison tables',
                          cotent: ['App info', 'Ranking', 'Review', 'Top Keywords', 'Pricing', 'Popular Comparisons'],
                        },
                      ].map((item, index) => (
                        <Col key={index} className="dashboard-explore_box">
                          <div className="content">
                            <div className="content-left">
                              <Typography.Text level={1} className="content-left_title">
                                {item.title}
                              </Typography.Text>
                              <div className="content-left_children">
                                <Typography.Text>{item.value}</Typography.Text>
                                <ul>
                                  {item.cotent.map((text, idx) => (
                                    <li key={idx}>
                                      <Typography.Text>{text}</Typography.Text>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                            <div className="image_unlock">
                              <Image
                                src={item.image}
                                width={663}
                                height={435}
                                alt="icon"
                                objectFit="cover"
                                unoptimized
                              />
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  )}
                </FadeInSection>
              </Col>
            </Row>
          </FadeInSection>
        </div>

        <FadeInSection>
          <div className="layout-landing-page-collection">
            <div className="container">
              <Row justify="center">
                <Typography.Title className="primary-color" level={3}>
                  App Collection
                </Typography.Title>
              </Row>
              <Row justify="space-between">
                <Col className="bordered">
                  <TableApp
                    item={{
                      title: 'New Release',
                      data: renderDataSource(data?.topApp.topRelease),
                    }}
                  />
                </Col>
                <Col className="bordered-left">
                  {[
                    {
                      title: 'Top Movers',
                      data: renderDataSource(data?.topApp.topMovers),
                    },
                    {
                      title: 'Most Reviewed',
                      data: renderDataSource(data?.topApp.topReviews),
                    },
                  ].map((item, index) => (
                    <div key={index} className="bordered-left-styled">
                      <TableApp item={item} />
                    </div>
                  ))}
                </Col>
              </Row>
            </div>
          </div>
        </FadeInSection>

        {isShowOnboarding === false ? (
          <FadeInSection>
            <CompareApp />
          </FadeInSection>
        ) : (
          <CompareApp />
        )}

        <FadeInSection>
          <div className="layout-landing-page-download">
            <div className="container">
              <Row justify={'center'}>
                <Row style={{ height: '100%' }}>
                  <Col xl={12} lg={24} className="mt-30">
                    <Row>
                      <Typography.Text className="download-title">Ready to win your App Market?</Typography.Text>
                    </Row>
                    <Row>
                      <Button
                        className="button-getKey"
                        onClick={() => router.push(`${LayoutPaths.Auth}${Paths.LoginApp}`)}
                      >
                        Get your key to success
                      </Button>
                    </Row>
                  </Col>
                  <Col xl={12} className="download-cols">
                    <Row align="bottom" justify="center" style={{ height: '100%' }}>
                      {COLUMNS.map((item, index) => (
                        <Col
                          key={index}
                          className="cols"
                          style={{
                            height: item.height,
                            background: item.color,
                          }}
                        />
                      ))}
                    </Row>
                  </Col>
                </Row>
              </Row>
            </div>
          </div>
        </FadeInSection>
      </div>
    </>
  );
};

export default LandingPage;
