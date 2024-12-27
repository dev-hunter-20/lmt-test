import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export const getDataByDate = (type, id, fromDate, toDate, isLanguage) => {
  if (fromDate && toDate && typeof fromDate === 'string') {
    return `${URL_API}${type}${id}${!isLanguage ? '?' : '&'}start_date=${fromDate}&end_date=${toDate}`;
  }
  return `${URL_API}${type}${id}`;
};

export default class DashboardApiService {
  static async getAppsByDay(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_app/app_by_day', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getStatusApps(fromDate, toDate) {
    const header = { method: 'GET' };
    const api = getDataByDate('dashboard_app/status_app2', '', fromDate, toDate);
    const response = await CommonCall(api, header);
    return response;
  }

  static async getAppsMostReview(page, per_page) {
    const header = { method: 'GET' };
    const api = getDataByDate(
      'dashboard_app/app_most_review',
      `?page=${page}&per_page=${per_page}`,
      true,
    );
    const response = await CommonCall(api, header);
    return response;
  }
  static async getAppsBFS(fromDate, toDate) {
    const api = getDataByDate('dashboard_app/app_built_for_shopify2', '', fromDate, toDate);
    const response = await CommonCall(api);
    return response;
  }
  static async getAppsByDate(type, date, page, per_page) {
    const response = await CommonCall(
      `${URL_API}dashboard_app/app_by_date?sort_by=${type}&date=${date}&page=${page}&per_page=${per_page}`,
    );
    return response;
  }
  static async getBFSByDate(date, sort_type) {
    const response = await CommonCall(
      `${URL_API}dashboard_app/app_built_for_shopify_by_date2?&date=${date}&sort_type=${sort_type}`,
    );
    return response;
  }
  static async getListDeactiveApps(sort_type, page, per_page, sort_by) {
    const response = await CommonCall(
      `${URL_API}dashboard_app/deactivate_app?sort_type=${sort_type}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
    );
    return response;
  }
  static async getIntegrations(page, per_page, sort_by) {
    const response = await CommonCall(
      `${URL_API}dashboard_app/integration_capabilities?page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
    );
    return response;
  }
  static async getIntegrationsApp(id, page, per_page, sort_by) {
    const response = await CommonCall(
      `${URL_API}dashboard_app/app_integration?integrations=${id}&page=${page}&per_page=${per_page}&sort_by=${sort_by}`,
    );
    return response;
  }
}
