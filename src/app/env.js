const env = {
  siteName: process.env.NEXT_PUBLIC_REACT_APP_SITE_NAME ?? '',
  domain: process.env.NEXT_PUBLIC_REACT_APP_DOMAIN_NAME ?? '',
  rootUrl: process.env.NEXT_PUBLIC_REACT_APP_ROOT_URL ?? '',
  rootAppUrl: process.env.NEXT_PUBLIC_REACT_APP_URL_APP ?? '',
  api: {
    baseUrl: {
      service: process.env.NEXT_PUBLIC_REACT_APP_SERVICE_BASE_URL ?? '',
      app: process.env.NEXT_PUBLIC_REACT_APP_SERVICE_APP_BASE_URL ?? '',
      subservice: process.env.REACT_APP_SERVICE_APP_BASE_SUB_URL ?? '',
    },
  },
  cookie: {
    domain: process.env.NEXT_PUBLIC_REACT_APP_COOKIE_DOMAIN ?? '',
  },
};

export default env;
