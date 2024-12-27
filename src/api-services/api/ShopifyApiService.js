import { URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';

export default class ShopifyApiService {
  static async connectPartnerApi(data) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        partner_id: data.partnerId,
        api_key: data.apiKey,
      }),
    };
    const response = await CommonCall(`${URL_API}connect_shopify/connect_partner_api`, header);
    return response;
  }
  static async listPartnerConnected() {
    const response = await CommonCall(`${URL_API}connect_shopify/list_partner`);
    return response;
  }
}
