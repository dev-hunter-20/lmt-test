import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class CategoriesApiService {
  static async getCategories() {
    const result = await CommonCall(`${URL_API}category`);
    return result;
  }
  static async getConversationCategory(
    id,
    sort_by,
    page,
    per_page,
    language,
    sort_type,
    price_type,
    price_min,
    price_max,
  ) {
    const header = { method: 'GET' };
    const result = await CommonCall(
      `${URL_API}category/${id}?sort_by=${sort_by}&language=${language}${
        sort_type === 'rank' ? '' : `&sort=${sort_type}`
      }${price_type === 'all' ? '' : `&price_type=${price_type}`}${
        !price_max ? '' : `&price_range_min=${price_min}&price_range_max=${price_max}`
      }&page=${page}&per_page=${per_page}`,
      header,
    );
    return result;
  }
  static async getConversationCollection(
    id,
    sort_by,
    page,
    per_page,
    language,
    sort_type,
    price_type,
    price_min,
    price_max,
  ) {
    const header = { method: 'GET' };
    const result = await CommonCall(
      `${URL_API}collection/${id}?sort_by=${sort_by}&language=${language}${
        sort_type === 'rank' ? '' : `&sort=${sort_type}`
      }${price_type === 'all' ? '' : `&price_type=${price_type}`}${
        !price_max ? '' : `&price_range_min=${price_min}&price_range_max=${price_max}`
      }&page=${page}&per_page=${per_page}`,
      header,
    );
    return result;
  }
}
