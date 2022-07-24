import { createSlice } from '@reduxjs/toolkit'

// init the initial State to local and check if the user already added to cart 
const userLocal = JSON.parse(localStorage.getItem('AuthUser'))
let userInit = null;
userLocal ? userInit = userLocal: userInit = null;

const initialState = {
  user: userInit
}

export const UserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    authenticate: (state, action) => {
        state.user = action.payload
        // add cart to localstorage
        toLocalStorage(state.user)
    },
    logout: (state) =>{
      state.user = null;
      localStorage.removeItem('AuthUser');
    }
  },
})


function toLocalStorage(user){
  localStorage.setItem('AuthUser', JSON.stringify(user));
}

// Action creators are generated for each case reducer function
export const { authenticate,logout } = UserSlice.actions

export default UserSlice.reducer

