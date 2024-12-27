import MyAppApiService from '@/api-services/api/MyAppApiService';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const initialState = {
  listMyApps: [],
  error: null,
  status: 'idle',
  loading: false,
};

export const getListMyApps = createAsyncThunk('myApps/getList', async () => {
  const response = await MyAppApiService.getMyApps();
  return response;
});

const myAppSlice = createSlice({
  name: 'myApps',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListMyApps.pending, (state) => {
        state.loading = true;
        state.status = 'loading';
      })
      .addCase(getListMyApps.fulfilled, (state, action) => {
        state.loading = false;
        state.status = 'succeeded';
        state.listMyApps = action.payload;
      })
      .addCase(getListMyApps.rejected, (state, action) => {
        state.loading = false;
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export default myAppSlice.reducer;
