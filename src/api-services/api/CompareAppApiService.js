import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class CompareAppService {
  static async compareApps(baseApp, compareApps) {
    const res = await CommonCall(`${URL_API}app/compare_app/${baseApp}/vs/${compareApps}`);
    return res;
  }
  static async getTopKeyWords(id) {
    const res = await CommonCall(`${URL_API}app/top_keywords/${id}`);
    return res;
  }
}
