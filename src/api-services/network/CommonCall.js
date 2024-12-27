import { fetchWithTimeOut } from '@/utils/functions';
import RefreshToken from './RefreshToken';
import Auth from '@/utils/store/Authentication';
import { LayoutPaths, Paths } from '@/router';

const CommonCall = async (api, header) => {
  try {
    const accessToken = Auth.getAccessToken();
    let headers;
    if (accessToken) {
      headers = {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      };
    } else {
      headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      };
    }
    if (header && (header.method === 'POST' || header.method === 'PUT' || header.method === 'GET')) {
      headers = {
        ...headers,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
      };
    }
    let head = {
      ...header,
      headers,
    };

    const response = await fetchWithTimeOut(
      fetch(api, {
        ...head,
        credentials: 'omit',
      }),
    );

    if (response.status === 500) {
      return {
        code: response.status,
        message: 'Server error',
        success: false,
      };
    }

    if (response.status === 200) {
      return await response.json();
    }

    if (response.status === 401) {
      //refresh token
      const resToken = await RefreshToken();

      if (resToken.success) {
        const newHeaders = {
          ...headers,
          Authorization: `Bearer ${resToken.access_token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'Access-Control-Request-Headers': '*',
        };
        const newHead = {
          ...head,
          headers: newHeaders,
        };
        const responseRefeshToken = await fetch(api, newHead);
        const resultRefeshToken = await responseRefeshToken.json();
        return resultRefeshToken;
      }
      if (response.status === 401) {
        Auth.logout();
        window.location.href = `${LayoutPaths.Auth}${Paths.LoginApp}`;
      } else {
        return {
          code: response.code,
          success: false,
        };
      }
    } else {
      const resJson = await response.json();
      return {
        code: resJson.status,
        message: resJson.message,
        success: false,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: 'Network error',
    };
  }
};

export default CommonCall;
