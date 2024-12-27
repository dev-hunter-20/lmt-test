import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class WatchAppChangeApiService {
  static async watchAppChange(id) {
    const body = {
      app_id: id,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const response = await CommonCall(`${URL_API}watched_my_app`, header);
    return response;
  }
}
