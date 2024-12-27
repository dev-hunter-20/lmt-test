import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class MyAppApiService {
  static async getMyApps() {
    const response = await CommonCall(`${URL_API}list_my_app`);
    return response.apps;
  }
  static async getNotifications() {
    const response = await CommonCall(`${URL_API}notification`);
    return response;
  }
  static async getCountNotifications() {
    const response = await CommonCall(`${URL_API}unread_notification`);
    return response;
  }
  static async getReadNotifications(notifications) {
    const body = {
      notifications: notifications.map((item) => item.notification),
    };
    const response = await CommonCall(`${URL_API}read_notification`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response;
  }
}
