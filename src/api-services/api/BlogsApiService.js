import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class BlogsApiService {
  static async getAllBlogs(page, per_page) {
    const response = await CommonCall(`${URL_API}blogs/all?page=${page}&per_page=${per_page}`);
    return response;
  }

  static async getBlogDetail(slug) {
    const response = await CommonCall(`${URL_API}blogs/${slug}`);
    return response;
  }
}
