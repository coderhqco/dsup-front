import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [], 
};

export const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    retrieveBills: (state, action) => {
      state.bills = action.payload;
    },
  },
});

export const { retrieveBills } = billSlice.actions;

export default billSlice.reducer;