import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class SearchDataApiService {
  static async searchData(search, page, size) {
    const body = {
      q: search,
      per_page: size,
      page: page,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const response = await CommonCall(`${URL_API}home/search_app`, header);
    return response;
  }
  static async searchDataHome(search, page, size) {
    const body = {
      q: search,
      per_page: size,
      page: page,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const response = await CommonCall(`${URL_API}home/search`, header);
    return response;
  }
}
