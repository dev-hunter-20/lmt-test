import { URL_SUB_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class PricingApiService {
  static async createSubscription(data) {
    const body = {
      subscriptionType: data.subscriptionType,
      period: data.period,
      returnUrl: data.returnUrl,
      cancelUrl: data.cancelUrl,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const api = `${URL_SUB_API}/user/subscriptions/order`;
    const result = await CommonCall(api, header);
    return result;
  }

  static async getCurrentSubcription() {
    const api = `${URL_SUB_API}/user/subscriptions/registed`;
    const result = await CommonCall(api);
    return result;
  }

  static async getSubscriptionProducts() {
    const api = `${URL_SUB_API}/user/subscriptions/product`;
    const result = await CommonCall(api);
    return result;
  }
}
