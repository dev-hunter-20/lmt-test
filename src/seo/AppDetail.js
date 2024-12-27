export const AppDetail = {
  title: (name, year) => `Shopify App Metrics and Analytics of ${name} in ${year}`,
  description: (name, metadesc) => `${name} - ${metadesc}`,
  metaTitle: (name, year) => `Shopify App Metrics and Analytics of ${name} in ${year}`,
  canonical: (app_id) => `https://letsmetrix.com/app/${app_id}`,
};

export const AppDetailReviews = {
  title: (name) => `Review: ${name} | Shopify app store metrics`,
  description: (name) =>
    `Get the latest Shopify ${name} rating and reviews. Check reviews by locations, time, nature of reviews and more to make a better decision.`,
  metaTitle: (name) => `${name} Reviews - Overall rating, reviews and more | Letsmetrix`,
  canonical: (app_id) => `https://letsmetrix.com/app/${app_id}/reviews`,
};

export const AppDetailPricings = {
  title: (name, year) => `${name} Price & Cost ${year} | Letsmetrix`,
  description: (name, app_compare) =>
    `Learn more about ${name} pricing plans. Compare ${app_compare} costs with other competitors with Letsmetrix.`,
  metaTitle: (name, year) => `${name} Price & Cost ${year} | Letsmetrix`,
  canonical: (app_id) => `https://letsmetrix.com/app/${app_id}/pricing`,
};

export const AppCompare = {
  title: (name, app_name_compare) => `Compare ${name} vs ${app_name_compare} | Letsmetrix`,
  description: (name, app_name_compare) =>
    `${name} vs ${app_name_compare} - Compare these two apps with real user reviews, feature comparisons, pricing, and screenshots. Find out which one suits your needs best.`,
  metaTitle: (name, app_name_compare) => `Compare ${name} vs ${app_name_compare} | Letsmetrix`,
  canonical: (app_id, app_id_compare) => `https://letsmetrix.com/app/${app_id}/compare-app/vs/${app_id_compare}`,
};
