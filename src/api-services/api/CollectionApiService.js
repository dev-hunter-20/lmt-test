import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class CollectionApiService {
  static async getCollections() {
    const result = await CommonCall(`${URL_API}collection`);
    return result;
  }
}
