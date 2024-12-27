import AuthApiService from '@/api-services/api/auth/AuthApiService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  isLoading: false,
  loading: 'idle' | 'pending' | 'succeeded' | 'failed',
  error: null,
};

export const resetPassword = createAsyncThunk('auth/resetPassword', async (credentials, { rejectWithValue }) => {
  try {
    const response = await AuthApiService.resetPassword({ body: credentials });
    if (response.code === 200) {
      return response;
    }
  } catch (err) {
    return rejectWithValue('An error has occurred !');
  }
});

const resetPasswordSlice = createSlice({
  name: 'resetPassword',
  initialState,
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.loading = 'pending';
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loading = 'succeeded';
        state.error = null;
        state.email = action.meta.arg.email;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.loading = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { resetError } = resetPasswordSlice.actions;
export default resetPasswordSlice.reducer;
