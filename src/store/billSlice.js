import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [], 
};

export const billSlice = createSlice({
  name: 'bill',
  initialState,
  reducers: {
    setBills: (state, action) => {
      state.bills = action.payload;
    },
  },
});

export const { setBills } = billSlice.actions;

export default billSlice.reducer;