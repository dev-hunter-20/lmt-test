import { landingPage } from './LandingPage';

export const DeveloperDashboard = {
  title: `Developer Dashboard - ${landingPage.title}`,
};

export const DeveloperBySlug = {
  title: (name) => `Apps by ${name} - Letsmetrix | Shopify app store metrics`,
  description: (name) =>
    `Check the full list of available Shopify apps by ${name} with average rating and number of reviews with Letsmetrix.`,
  metaTitle: (name, year) => `Listed Shopify Apps by ${name} in ${year} | Letsmetrix`,
  metaDesc: (name) =>
    `Get the latest Shopify ${name} rating and reviews. Check reviews by locations, time, nature of reviews and more to make a better decision.`,
  canonical: (developer_id) => `https://letsmetrix.com/developer/${developer_id}`,
};
