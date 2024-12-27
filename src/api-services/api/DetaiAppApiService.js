import { DOMAIN, URL_API } from '@/constants/ApiUrl';
import CommonCall from '../network/CommonCall';
import { getDataByDate } from './DashboardApiService';
import { renderSentiment } from '@/utils/functions';

export default class DetailAppApiService {
  static async saveAppGid(data) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        app_id: data.appId,
        app_gid: data.appGid,
        partner_api_id: data.partnerApiId,
      }),
    };
    const result = await CommonCall(`${URL_API}connect_shopify/save_app_gid`, header);
    return result;
  }
  static async getPositionKeywordChangeByLang(id, language, sort_by, fromDate, toDate, compare_app_id) {
    const api = getDataByDate(
      `keyword/position_keyword_change/${
        compare_app_id ? `${compare_app_id}/` : ''
      }${id}?language=${language}&sort_by=${sort_by}`,
      '',
      fromDate,
      toDate,
      true,
    );
    const result = await CommonCall(api);
    return result;
  }
  static async getPositionKeywordByLang(id, language, fromDate, toDate, compare_app_id) {
    const api = getDataByDate(
      `keyword/position_keyword/${compare_app_id ? `${compare_app_id}/` : ''}${id}?language=${language}`,
      '',
      fromDate,
      toDate,
      true,
    );
    const result = await CommonCall(api);
    return result;
  }
  static async addCompetitor(appId, compareId) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        app_id: appId,
        compare_id: compareId,
      }),
    };
    const result = await CommonCall(`${URL_API}app/add_competitor`, header);
    return result;
  }
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
    const result = await CommonCall(`${URL_API}home/search_app`, header);
    return result;
  }
  static async getSuggestKeyword(id) {
    const result = await CommonCall(`${URL_API}keyword/suggest_keyword?app_id=${id}`);
    return result;
  }
  static async checkExistsUserKeyword(app_id, keyword) {
    const body = {
      app_id,
      keyword,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}keyword/check_exists_user_keyword`, header);
    return result;
  }
  static async getDataCompetitor(id) {
    const result = await CommonCall(`${URL_API}app/compare_app/${id}`);
    return result;
  }
  static async createKeyword(keywords, id) {
    const body = {
      keywords: keywords,
      app_id: id,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}keyword/add_keyword`, header);
    return result;
  }
  static async orderCompareApp(id, apps) {
    const body = {
      compare_id: apps,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}app/reorder_app_competitor/${id}`, header);
    return result;
  }
  static async handleFollowApp(id, isFollow) {
    const body = {
      app_id: id,
      is_follow: isFollow,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}app/follow_app`, header);
    return result;
  }
  static async deleteCompetitor(appId, compareId) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        app_id: appId,
        compare_id: compareId,
      }),
    };
    const result = await CommonCall(`${URL_API}app/del_competitor`, header);
    return result;
  }
  static async getAppInfoLogged(id, fromDate, toDate) {
    const api = getDataByDate('app/info_app_logged/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getAppInfo(id) {
    const result = await CommonCall(`${URL_API}app/info/${id}`);
    return result;
  }
  static async getRatingChange(id, fromDate, toDate) {
    const api = getDataByDate('app/rating_change/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getReviewsChange(id, fromDate, toDate) {
    const api = getDataByDate('app/review_change/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getChangeLog(id, fromDate, toDate) {
    const api = getDataByDate('app/change_log_tracking/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getCategoryPositionChange(id, fromDate, toDate) {
    const api = getDataByDate('category/position_change/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getCategoryPosition(id, fromDate, toDate) {
    const api = getDataByDate('category/position/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getCollectionPosition(id, fromDate, toDate) {
    const api = getDataByDate('collection/position/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getGaData(id, fromDate, toDate) {
    const api = getDataByDate('app/ga_data/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getEarning(id, fromDate, toDate) {
    const api = getDataByDate('partner/earning_by_date/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getInstallApp(id, fromDate, toDate) {
    const api = getDataByDate('partner/install_by_date/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getUninstallApp(id, fromDate, toDate) {
    const api = getDataByDate('partner/uninstall_by_date/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getMerchantApp(id, fromDate, toDate) {
    const api = getDataByDate('partner/merchant_by_date/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getRetensionApp(id, fromDate, toDate) {
    const api = getDataByDate('partner/retention2/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getEarningByPlan(id, fromDate, toDate) {
    const api = getDataByDate('partner/earning_by_pricing/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getUninstallByTime(id, fromDate, toDate) {
    const api = getDataByDate('partner/uninstalled_shop_by_time2/', id, fromDate, toDate);
    const result = await CommonCall(api);
    return result;
  }
  static async getReinstallShopByTime(id) {
    const api = getDataByDate('partner/reinstalled_shop_by_time/', id);
    const result = await CommonCall(api);
    return result;
  }
  static async gaLogin(id) {
    const result = await CommonCall(`${URL_API}ga_login?redirect_url=${DOMAIN}ga_callback&app_id=${id}`);
    return result;
  }
  static async gaDisconnect(id) {
    const result = await CommonCall(`${URL_API}ga_disconnect?redirect_url=${DOMAIN}ga_callback&app_id=${id}`);
    return result;
  }
  static async disconnectPartner(id) {
    const result = await CommonCall(`${URL_API}connect_shopify/shopify_disconnect?app_id=${id}`);
    return result;
  }
  static async connectPartner(id) {
    const result = await CommonCall(`${URL_API}connect_shopify/shopify_connect?app_id=${id}`);
    return result;
  }
  static async handleTrackingApp(id, isOwner) {
    const body = {
      app_id: id,
      is_owner: isOwner,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}add_my_app`, header);
    return result;
  }
  static async reloadKeyword(id) {
    const body = {
      app_id: id,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}keyword/fetch_keyword`, header);
    return result;
  }
  static async saveKeywordPriority(appId, listKeword) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        app_id: appId,
        keyword_list: listKeword,
      }),
    };
    const result = await CommonCall(`${URL_API}keyword/save_keyword_priority`, header);
    return result;
  }
  static async getUninstallDetail(id, period) {
    const result = await CommonCall(`${URL_API}partner/detail_uninstalled_shop_by_time/${id}?period=${period}`);
    return result;
  }
  static async getDetailNumberReinstallShopByTime(id, period) {
    const result = await CommonCall(`${URL_API}partner/detail_number_reinstalled_shop_by_time/${id}?period=${period}`);
    return result;
  }
  static async getDetailReinstallShopByTime(id, shop_domain) {
    const result = await CommonCall(
      `${URL_API}partner/detail_reinstalled_shop_by_time/${id}?shop_domain=${shop_domain}`,
    );
    return result;
  }
  static async getRetentionDetail(id, date, type) {
    const result = await CommonCall(`${URL_API}partner/detail_retention/${id}?date=${date}&type=${type}`);
    return result;
  }
  static async getDataGa(data) {
    const body = {
      date: data.date,
      field: data.field,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}app/ga_data/${data.app_id}`, header);
    return result;
  }
  static async changeKeywordInChart(appId, keyword, showInChart) {
    const header = {
      method: 'POST',
      body: JSON.stringify({
        app_id: appId,
        keyword: keyword,
        show_in_chart: showInChart,
      }),
    };
    const result = await CommonCall(`${URL_API}keyword/save_keyword_in_chart`, header);
    return result;
  }
  static async deleteKeyword(keyword, id) {
    if (id) {
      const body = {
        keyword: keyword,
        app_id: id,
      };
      const header = {
        method: 'POST',
        body: JSON.stringify(body),
      };
      const result = await CommonCall(`${URL_API}keyword/del_keyword`, header);
      return result;
    } else {
      const body = {
        keyword: keyword,
      };
      const header = {
        method: 'POST',
        body: JSON.stringify(body),
      };
      const result = await CommonCall(`${URL_API}del_keyword`, header);
      return result;
    }
  }

  static async reloadKeywordItem(id, keyword) {
    const body = {
      app_id: id,
      keyword: keyword,
    };
    const header = {
      method: 'POST',
      body: JSON.stringify(body),
    };
    const result = await CommonCall(`${URL_API}fetch_keyword`, header);
    return result;
  }
  static async getReviewApp(
    id,
    is_deleted,
    page,
    per_page,
    sort_by,
    reviewer_location,
    time_spent_using_app,
    rating,
    sentiment,
    time_reply,
  ) {
    const result = await CommonCall(
      `${URL_API}reviews?app_id=${id}${
        is_deleted ? `&is_deleted=${is_deleted}` : ''
      }&page=${page}&per_page=${per_page}&sort_by=${sort_by}&reviewer_location=${reviewer_location}&time_spent_using_app=${time_spent_using_app}&rating=${rating}${
        sentiment ? renderSentiment(sentiment) : ''
      }&time_reply=${time_reply}`,
    );
    return result;
  }
  static async getReviewAppInfoSummary(id) {
    const result = await CommonCall(`${URL_API}reviews/summary?app_id=${id}`);
    return result;
  }
  static async getReviewDashboard(page, per_page, reviewer_location, reviewer_name, created_at, is_deleted) {
    const result = await CommonCall(
      `${URL_API}reviews?is_deleted=${is_deleted}&page=${page}&per_page=${per_page}&reviewer_location=${reviewer_location}&create_date=${created_at}&reviewer_name=${reviewer_name}`,
    );
    return result;
  }
  static async gaSyncGoogle(state, code) {
    const result = await CommonCall(
      `${URL_API}ga_callback?redirect_url=${DOMAIN}ga_callback&state=${state}&code=${code}`,
    );
    return result;
  }
  static async getKeywordByLanguage(keyword, page, perPage, sort_by, sort_type, language, fromDate, toDate) {
    const api = getDataByDate(
      `keyword/${keyword}?language=${language}&page=${page}&per_page=${perPage}&sort_by=${sort_by}&sort_type=${sort_type}`,
      '',
      fromDate,
      toDate,
      true,
    );
    const result = await CommonCall(api);
    return result;
  }
}
