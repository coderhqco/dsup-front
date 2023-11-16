import { createSlice } from '@reduxjs/toolkit';

const billsLocal = JSON.parse(localStorage.getItem('bills'));

let billsInit = null;

billsLocal ? billsInit = billsLocal : billsInit = [];

const initialState = {
  bills: billsInit
};

export const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    retrieveBillsSuccess: (state, action) => {
      state.bills = action.payload;
      toLocalStorage('bills', state.bills)
    },
    retrieveBillsFailure: (state) => {
      state.bills = [];
    },
  },
});

function toLocalStorage(store, bills) {
  localStorage.setItem(store, JSON.stringify(bills));
}


export const { setBills, retrieveBillsSuccess, retrieveBillsFailure } = billSlice.actions;

export default billSlice.reducer;