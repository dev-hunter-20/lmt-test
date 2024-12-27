import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';
import CommonCallCustom from '../network/CommonCallCustom';

export default class LandingPageApiService {
  static async getTop5Apps(id) {
    const response = await CommonCall(`${URL_API}home/top_app_in_category?category=${id}`);
    return response;
  }
  static async getCategoriesHome() {
    const response = await CommonCall(`${URL_API}home/all_category`);
    return response;
  }
  static async getGrowthRateApps(page, per_page) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps_sub/by_growth_rate?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getTopReviewHome(page, per_page) {
    const response = await CommonCall(`${URL_API}dashboard_top_apps_sub/top_review?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getTopReleaseHome(page, per_page) {
    const response = await CommonCall(`${URL_API}home/top_release?page=${page}&per_page=${per_page}`);
    return response;
  }
  static async getCount() {
    const response = await CommonCall(`${URL_API}home/count`);
    return response;
  }
  static async getBlogs() {
    const response = await CommonCall(`${URL_API}blogs/get_for_landing_page`);
    return response;
  }
  static async getBlogSlug(slug) {
    const response = await CommonCallCustom(`${DOMAIN}admin-blog/wp-json/wp/v2/blogs?slug=${slug}`);
    return response;
  }
  static async getAuthor(author) {
    const response = await CommonCallCustom(`${DOMAIN}admin-blog/wp-json/wp/v2/users/${author}`);
    return response;
  }
  static async getImageUrl(featured_media) {
    const response = await CommonCallCustom(`${DOMAIN}admin-blog/wp-json/wp/v2/media/${featured_media}`);
    return response;
  }
  static async handleShowOnboard(show_onboarding, skip_step) {
    const body = {
      show_onboarding,
      skip_step,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const api = `${URL_API}onboarding`;
    if (skip_step) {
      const result = await CommonCall(api, header);
      return result;
    }
    const result = await CommonCall(api);
    return result;
  }
}
