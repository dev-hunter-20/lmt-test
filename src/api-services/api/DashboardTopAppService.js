import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export const getDataByDate = (type, id, fromDate, toDate, isLanguage) => {
  if (fromDate && toDate && typeof fromDate === 'string') {
    return `${URL_API}${type}${id}${!isLanguage ? '?' : '&'}start_date=${fromDate}&end_date=${toDate}`;
  }
  return `${URL_API}${type}${id}`;
};

export default class DashboardTopAppService {
  static async getTopNewApps(page, per_page) {
    const response = await CommonCall(`${URL_API}home/top_release?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getTopReview(page, per_page) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps_sub/top_review?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getTopGrowthReview(fromDate, toDate, page, per_page) {
    const header = { method: 'GET' };
    const api = getDataByDate(
      'dashboard_top_apps_sub/top_growth_review',
      `?page=${page}&per_page=${per_page}`,
      fromDate,
      toDate,
      true,
    );
    const response = await CommonCall(api, header);
    return response;
  }
  static async getGrowthRate(page, per_page) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps_sub/by_growth_rate?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getInstallationGrowthRate(page, per_page) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps_sub/installation_growth_rate?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getDashboardGrowthReview() {
    const response = await CommonCall(`${URL_API}dashboard_top_apps/growth_review`);
    return response;
  }
  static async getDashboardReviewCategory(category) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps/review_in_category?category=${category}`);
    return response;
  }
  static async getDashboardMostReview() {
    const response = await CommonCall(`${URL_API}dashboard_top_apps/most_review`);
    return response;
  }
  static async getDashboardGrowthRate() {
    const response = await CommonCall(`${URL_API}dashboard_top_apps/growth_rate`);
    return response;
  }
  static async getDashboardGrowthApps(page, per_page, start_date, end_date, category_id, bfs, period_review) {
    const queryString = `?page=${page}&per_page=${per_page}&start_date=${start_date}&end_date=${end_date}&category_id=${category_id}&bfs=${bfs}&period_review=${period_review}`;
    const api = getDataByDate('dashboard_top_apps_sub/apps', queryString);
    const response = await CommonCall(api);
    return response;
  }
}
