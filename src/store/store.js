import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import billReducer from './billSlice.js';

export const store = configureStore({
  reducer: {
    AuthUser: userReducer,
    bills: billReducer,
  },
})