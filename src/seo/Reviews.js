import { landingPage } from './LandingPage';

export const ReviewDetail = {
  canonical: (query) => `https://letsmetrix.com/dashboard/review?${query}`,
};

export const DashboardReview = {
  title: `Review Dashboard - ${landingPage.title}`,
  canonical: `https://letsmetrix.com/dashboard/reviews`,
};
