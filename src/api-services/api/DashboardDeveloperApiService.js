import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

function getDataByDate(type, id, fromDate, toDate, isLanguage) {
  if (fromDate && toDate && typeof fromDate === "string") {
    return `${URL_API}${type}${id}${
      !isLanguage ? "?" : "&"
    }start_date=${fromDate}&end_date=${toDate}`;
  }
  return `${URL_API}${type}${id}`;
}

export default class DashboardDeveloperApiService {
  static async getDeveloperByDay(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_developer/total_new_developer_by_day', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getDeveloperMostApps(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_developer/apps_in_developer', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getNewDevelopers(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_developer/developer_newest', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getStatusDevelopers(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_developer/status_developer', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getStatusDevelopers(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_developer/status_developer', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }
  
  static async getDetailDeveloper(id, page, per_page, sort_type) {
    const body = {
      page: page,
      per_page: per_page,
      sort_type: sort_type
    };
    const header = {
      method: "POST",
      body: JSON.stringify(body),
    };
    const response = await CommonCall(`${URL_API}partner/${id}`, header);
    return response;
  }

  static async getMostFrequentPartnerCountry() {
    const header = { method: 'GET' };
    const response = await CommonCall(`${URL_API}dashboard_developer/developer_country`, header);
    return response;
  }
  
  static async getDeveloperByDate(page, perPage, date) {
    const header = { method: 'GET' };
    const response = await CommonCall(`${URL_API}developer/create_date?page=${page}&per_page=${perPage}&create_date=${date}`, header);
    return response;
  }

}