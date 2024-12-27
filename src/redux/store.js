import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './slice';

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(),
  devTools: true,
});

export default store;
