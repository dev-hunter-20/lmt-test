import { EResponseCode } from '@/common/enums';
import { LayoutPaths } from '@/router';
import AuthHelpers from './auth-helpers';

let isRefreshingAccessToken = false;
let tokenSubscribers = [];

const AuthorizedInstance = (baseURL) => {
  const refreshTokens = async () => {
    const existingRefreshToken = AuthHelpers.getRefreshToken();

    if (!existingRefreshToken) {
      // Navigate to Auth Layout
      if (typeof window !== 'undefined') {
        window.location.href = LayoutPaths.Auth;
      }
      return;
    }

    return AuthHelpers.getAccessToken();
  };

  const onTokenRefreshed = (error, newAccessToken) => {
    tokenSubscribers.forEach((cb) => cb(error, newAccessToken));
  };

  const fetchWithAuth = async (url, options = {}) => {
    const authBearer = AuthHelpers.getAccessToken();
    if (authBearer) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${authBearer}`,
      };
    }

    const response = await fetch(`${baseURL}${url}`, options);

    if (!response.ok) {
      const errorResponse = await response.json().catch(() => ({}));
      const error = new Error(errorResponse.message || 'Unknown error');
      error.response = response;
      throw error;
    }

    return response.json();
  };

  const onResponseError = async (url, options) => {
    const originalRequest = { url, options };

    if (originalRequest) {
      if (!isRefreshingAccessToken) {
        isRefreshingAccessToken = true;

        refreshTokens()
          .then((newAccessToken) => {
            onTokenRefreshed(null, newAccessToken);
          })
          .catch((err) => {
            onTokenRefreshed(new Error('Failed to refresh access token'));
            const refreshTokenFailed = err?.response?.url === ' '; // Config refresh token URL

            if (refreshTokenFailed) {
              AuthHelpers.clearTokens();
              // Navigate to Auth Layout
              if (typeof window !== 'undefined') {
                window.location.href = LayoutPaths.Auth;
              }
              return;
            }
          })
          .finally(() => {
            isRefreshingAccessToken = false;
            tokenSubscribers = [];
          });
      }

      const storeOriginalRequest = new Promise((resolve, reject) => {
        tokenSubscribers.push((error, newAccessToken) => {
          if (error) return reject(error);

          originalRequest.options.headers.Authorization = `Bearer ${newAccessToken}`;

          return resolve(fetchWithAuth(originalRequest.url, originalRequest.options));
        });
      });

      return storeOriginalRequest;
    }

    throw new Error('Network response was not ok');
  };

  return {
    fetch: async (url, options = {}) => {
      try {
        return await fetchWithAuth(url, options);
      } catch (error) {
        if (error.response?.status === EResponseCode.UNAUTHORIZED) {
          return onResponseError(url, options);
        }
        throw error;
      }
    },
  };
};

export default AuthorizedInstance;
