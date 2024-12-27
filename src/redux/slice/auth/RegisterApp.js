import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  username: null,
  fullname: null,
  email: null,
  password: null,
  isLoading: false,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
  error: null,
};

export const registerApp = createAsyncThunk('auth/registerApp', async (body, { rejectWithValue }) => {
  try {
    const response = await AuthApiService.registryTrialSubscriptions(body);
    if (response.code === 0) {
      return response;
    } else {
      return rejectWithValue(response.message);
    }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const registerAppSlice = createSlice({
  name: 'registerApp',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerApp.pending, (state) => {
        state.isLoading = true;
        state.loading = 'pending';
      })
      .addCase(registerApp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loading = 'succeeded';
        state.error = null;
        state.username = action.payload.username;
        state.fullname = action.payload.fullname;
        state.email = action.payload.email;
        state.password = action.payload.password;
      })
      .addCase(registerApp.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetError } = registerAppSlice.actions;
export default registerAppSlice.reducer;
