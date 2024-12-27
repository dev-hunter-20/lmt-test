import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';
import { getDataByDate } from './DashboardApiService';

export default class DashboardReviewsApiService {
  static async getTotalReviews(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/total_review_in_30days', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async getReviewDeleted(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/review_delete', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async getTopNewReviews(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/review_newest', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async storeMostReview(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/store_most_review', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async locationMostReview(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/location_most_review', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async getReviewCategory(fromDate, toDate) {
    const api = getDataByDate('dashboard_review/total_review_in_category', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async getDetailReview(id) {
    const response = await CommonCall(`${URL_API}reviews/${id}`);
    return response;
  }
}
