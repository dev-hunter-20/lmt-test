import { createSlice } from '@reduxjs/toolkit';

const onboardingStateSlice = createSlice({
  name: 'onboardingState',
  initialState: {
    isShowOnboardingState: false,
  },
  reducers: {
    showOnboarding: (state) => {
      state.isShowOnboardingState = true;
    },
    hideOnboarding: (state) => {
      state.isShowOnboardingState = false;
    },
  },
});

export const { showOnboarding, hideOnboarding } = onboardingStateSlice.actions;
export default onboardingStateSlice.reducer;
