import { createSlice } from '@reduxjs/toolkit'

// init the initial State to local and check if the user already added to cart 
const userLocal = JSON.parse(localStorage.getItem('AuthUser'))
const podLocal = JSON.parse(localStorage.getItem('pod'))
const podMembersLocal = JSON.parse(localStorage.getItem('podMembers'))

let userInit = null;
let podInit = null;
let podMembersInit = null
userLocal ? userInit = userLocal: userInit = null;
podLocal ? podInit = podLocal: podInit = null;
podMembersLocal ? podMembersInit = podMembersLocal: podMembersInit = null;

const initialState = {
  user: userInit,
  pod: podInit,
  podMembers: podMembersInit
}

export const UserSlice = createSlice({
  name: 'authUser',
  initialState,
  reducers: {
    authenticate: (state, action) => {
        state.user = action.payload
        // add cart to localstorage
        toLocalStorage('AuthUser',state.user)
    },
    logout: (state) =>{
      state.user = null;
      localStorage.removeItem('AuthUser');
      localStorage.removeItem('pod');
      localStorage.removeItem('podMembers');
    },
    pod:(state,action) =>{
      state.pod = action.payload
      toLocalStorage('pod',state.pod);
    },
    addPodmMembers:(state, action)=>{
      state.podMembers = action.payload;
      toLocalStorage('podMembers', state.podMembers)
    }
  },
})

function toLocalStorage(store,user){
  localStorage.setItem(store, JSON.stringify(user));
}

// Action creators are generated for each case reducer function
export const { authenticate,logout, pod, addPodmMembers } = UserSlice.actions
export default UserSlice.reducer

