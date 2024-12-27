import { landingPage } from "./LandingPage";

export const AppDashboard = {
  title: `Application Dashboard - ${landingPage.title}`,
};

export const categories = {
  title: (category, year) => `Top ${category} Apps For ${year} - Letsmetrix | Shopify app store metrics`,
  description: (category) =>
    `Letsmetrix provides better insights about all ${category} apps on Shopify: highlights, price type, price range, rating and reviews,...`,
  metaTitle: (name) => `All Shopify apps in the ${name} category`,
  canonical: (slug) => `https://letsmetrix.com/category/${slug}`,
};

export const collections = {
  title: (category, year) => `Top ${category} Apps For ${year} - Letsmetrix | Shopify app store metrics`,
  description: (category, year) =>
    `Letsmetrix helps you discover the latest list of best ${category} on Shopify with important highlights, rating, and reviews in ${year}.`,
  metaTitle: (name, year) => `Best ${name} on Shopify App Store ${year} | Letsmetrix`,
  canonical: (slug) => `https://letsmetrix.com/collection/${slug}`,
};
