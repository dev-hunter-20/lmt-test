import LandingPageApiService from '@/api-services/api/LandingPageApiService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchOnboardStatus = createAsyncThunk('onboard/fetchOnboard', async () => {
  const response = await LandingPageApiService.handleShowOnboard();
  return response;
});

const onboardingSlice = createSlice({
  name: 'onboarding',
  initialState: {
    isShowOnboarding: false,
    skipStep: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnboardStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOnboardStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isShowOnboarding = action.payload.show_onboarding;
        state.skipStep = action.payload.skip_step;
      })
      .addCase(fetchOnboardStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default onboardingSlice.reducer;
