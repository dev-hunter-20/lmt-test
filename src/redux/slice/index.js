import { combineReducers } from '@reduxjs/toolkit';
import myAppsReducer from './my-apps/MyApps';
import loginAppReducer from './auth/LoginApp';
import registerAppReducer from './auth/RegisterApp';
import resetPasswordReducer from './auth/ResetPassword';
import onboardingStateReducer from './onboarding/OnboadingState';
import onboardingReducer from './onboarding/Onboading';

const rootReducer = combineReducers({
  myApps: myAppsReducer,
  loginApp: loginAppReducer,
  registerApp: registerAppReducer,
  resetPassword: resetPasswordReducer,
  onboardingState: onboardingStateReducer,
  onboarding: onboardingReducer,
});

export default rootReducer;
