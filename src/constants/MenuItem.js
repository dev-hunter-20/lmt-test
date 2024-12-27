export const MENU_ITEMS = [
  {
    key: 'apps',
    title: 'Apps',
    hasSub: true,
    linkTo: '/dashboard',
  },
  {
    key: 'topApps',
    title: 'Top Apps',
    hasSub: true,
    linkTo: '/dashboard/top-apps',
  },
  {
    key: 'blogs',
    title: 'Blogs',
    linkTo: '/blogs',
  },
  {
    key: 'developers',
    title: 'Developers',
    linkTo: '/developers',
  },
  {
    key: 'reviews',
    title: 'Reviews',
    linkTo: '/dashboard/reviews',
  },
  {
    key: 'watching-apps',
    title: 'Watching',
    linkTo: '/watching-apps',
  },
  {
    key: 'compare-apps',
    title: 'Compare Apps',
    linkTo: '/#compare',
  },
  {
    key: 'my-apps',
    title: 'My Apps',
    nameShow: 'My Apps',
    isShowPopupMyApp: true,
    isCheckAuth: true,
  },
];

export const MENU_RESOURCE_ITEM = [
  {
    key: 'documents',
    title: 'Documents',
    linkTo: 'https://docs.letsmetrix.com/',
  },
  {
    key: 'blogs',
    title: 'Blogs',
    linkTo: '/blogs',
  },
];

export const MENU_TOP_APP_ITEM = [
  {
    key: 'review',
    title: 'Review',
    linkTo: '/top-reviewed',
  },
  {
    key: 'growth_apps',
    title: 'Growth Apps',
    linkTo: '/growth-apps',
  },
  {
    key: 'growth_review',
    title: 'Growth Review',
    linkTo: '/growth_review',
  },
  {
    key: 'growth_rate',
    title: 'Growth Rate',
    linkTo: '/growth_rate',
  },
  {
    key: 'installation_growth_rate',
    title: 'Installation Growth Rate',
    linkTo: '/installation_growth_rate',
  },
];

export const MENU_APPS_ITEM = [
  {
    key: 'categories',
    title: 'Categories',
    linkTo: '/categories',
  },
  {
    key: 'collections',
    title: 'Collections',
    linkTo: '/collections',
  },
  {
    key: 'new-apps',
    title: 'New Apps',
    linkTo: '/top-new-apps',
  },
  {
    key: 'built-for-shopify',
    title: 'Built For Shopify',
    linkTo: '/collection/built-for-shopify',
  },
  {
    key: 'delisted-deleted',
    title: 'Delisted or Deleted Apps',
    linkTo: '/delisted-deleted',
  },
  {
    key: 'integrations',
    title: 'Integrations Capabilities',
    linkTo: '/integrations',
  },
  {
    key: 'top-apps',
    title: 'Top Apps',
    linkTo: '/dashboard/top-apps',
    submenu: MENU_TOP_APP_ITEM,
  },
];
export const MENU_APP_ITEM = [
  {
    key: 'categories',
    title: 'Categories',
    linkTo: '/categories',
  },
  {
    key: 'collections',
    title: 'Collections',
    linkTo: '/collections',
  },
  {
    key: 'new-apps',
    title: 'New Apps',
    linkTo: '/top-new-apps',
  },
  {
    key: 'built-for-shopify',
    title: 'Built For Shopify',
    linkTo: '/collection/built-for-shopify',
  },
  {
    key: 'delisted-deleted',
    title: 'Delisted or Deleted Apps',
    linkTo: '/delisted-deleted',
  },
  {
    key: 'integrations',
    title: 'Integrations Capabilities',
    linkTo: '/integrations',
  },
];

export const BREADCRUMB_ROUTES = [
  {
    path: '/blogs',
    label: 'Blogs',
  },
  {
    path: '/categories',
    label: 'Categories',
  },
  {
    path: '/collections',
    label: 'Collections',
  },
  {
    path: '/top-new-apps',
    label: 'Top New Apps',
  },
  {
    path: '/delisted-deleted',
    label: 'Delisted and Deleted Apps',
  },
  {
    path: '/integrations',
    label: 'Integrations',
  },
  {
    path: '/top-reviewed',
    label: 'Top Review',
  },
  {
    path: '/growth_review',
    label: 'Growth Review',
  },
  {
    path: '/growth_rate',
    label: 'Growth Rate',
  },
  {
    path: '/installation_growth_rate',
    label: 'Installation Growth Rate',
  },
  {
    path: '/dashboard',
    label: 'Apps Dashboard',
  },
  {
    path: '/developers',
    label: 'Developers Dashboard',
  },
  {
    path: '/watching-apps',
    label: 'Watching Apps',
  },
];

export const linkUnderline = [
  { href: '/about-us', title: 'About Us' },
  { href: '/privacy-policy', title: 'Privacy Policy' },
  { href: '/terms-of-use', title: 'Terms of use' },
];

export const menuLinks = [
  { href: '/pricing', title: 'Pricing', class: 'pricing__link' },
  { href: '/sitemap', title: 'Sitemap', class: 'faq__link' },
  { href: 'https://docs.letsmetrix.com/', title: 'Documents', class: 'faq__link' },
  { href: '/#compare', title: 'Compare Apps', class: 'faq__link' },
];

export const COLUMNS = [
  {
    height: '160px',
    color: '#CC9D24',
  },
  {
    height: '210px',
    color: 'linear-gradient(rgba(138, 106, 22, 1), rgba(178, 164, 35, 0))',
  },
  {
    height: '250px',
    color: 'linear-gradient(rgba(182, 131, 0, 1), rgba(181, 181, 181, 0))',
  },
  {
    height: '210px',
    color: 'linear-gradient(rgba(255, 194, 37, 1), rgba(182, 131, 0, 1))',
  },
  {
    height: '150px',
    color: 'linear-gradient(rgba(255, 194, 37, 1), rgba(255, 255, 255, 0.51))',
  },
  {
    height: '265px',
    color: 'linear-gradient(rgba(255, 238, 82, 1), rgba(182, 131, 0, 1))',
  },
  {
    height: '345px',
    color: 'linear-gradient(rgba(182, 131, 0, 1), rgba(255, 255, 255, 1))',
  },
];
