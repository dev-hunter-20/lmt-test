const currentUserKey = 'current-user';
const currentUNKey = 'current-un-Key';
const currentSubcriptionKey = 'current-subscription';

function setToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
}
function getAccessToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
}
function setAccessToken(accessToken) {
  if (typeof window !== 'undefined') {
    return localStorage.setItem('accessToken', accessToken);
  }
  return null;
}
function setRefreshToken(refreshToken) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refreshToken', refreshToken);
  }
}
function getRefreshToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refreshToken');
  }
  return null;
}

function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
}

function removeRefreshToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refreshToken');
  }
}

function setCurrentUser(currentUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentUserKey, currentUser);
  }
}

function getCurrentUser() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentUserKey);
  }
  return null;
}

function setCurrentUserName(currentUser) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentUNKey, currentUser);
  }
}

function getCurrentUserName() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentUNKey);
  }
  return null;
}

function removeCurrentUserName() {
  if (typeof window !== 'undefined') {
    return localStorage.removeItem(currentUNKey);
  }
  return null;
}

function setCurrentSubscription(currentSubType) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(currentSubcriptionKey, currentSubType);
  }
}

function getCurrentSubscription() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(currentSubcriptionKey);
  }
  return null;
}

function removeCurrentSubscription() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(currentSubcriptionKey);
  }
}

function removeCurrentUser() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(currentUserKey);
  }
}

function isAuthenticated() {
  return getAccessToken() !== undefined && getAccessToken() !== null;
}

let Auth = {
  setToken: setToken,
  setCurrentUser: setCurrentUser,
  getCurrentUser: getCurrentUser,
  setCurrentUserName: setCurrentUserName,
  getCurrentUserName: getCurrentUserName,
  setCurrentSubscription: setCurrentSubscription,
  getCurrentSubscription: getCurrentSubscription,
  getAccessToken: getAccessToken,
  setRefreshToken: setRefreshToken,
  getRefreshToken: getRefreshToken,
  isAuthenticated: isAuthenticated,
  setAccessToken: setAccessToken,
  logout() {
    removeToken();
    removeCurrentUser();
    removeRefreshToken();
    removeCurrentUserName();
    removeCurrentSubscription();
  },
};
export default Auth;
