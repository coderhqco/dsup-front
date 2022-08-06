import { createSlice } from '@reduxjs/toolkit'

// init the initial State to local and check if the user already added to cart 
const userLocal = JSON.parse(localStorage.getItem('AuthUser'))
const podLocal = JSON.parse(localStorage.getItem('pod'))
const podMembersLocal = JSON.parse(localStorage.getItem('podMembers'))
const podVonteIn = JSON.parse(localStorage.getItem('podVoteIn'))

let userInit = null;
let podInit = null;
let podMembersInit = null
let podVonteInInit = []
userLocal ? userInit = userLocal: userInit = null;
podLocal ? podInit = podLocal: podInit = null;
podMembersLocal ? podMembersInit = podMembersLocal: podMembersInit = null;
podVonteIn ? podVonteInInit = podVonteIn: podVonteInInit = [];

const initialState = {
  user: userInit,
  pod: podInit,
  podMembers: podMembersInit,
  podVoteIn:podVonteInInit,
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
    },
    desolvePod:(state, action)=>{
      state.pod = null
      state.podMembers = null
      localStorage.removeItem('pod');
      localStorage.removeItem('podMembers');
    },
    podVoteIn:(state, action)=>{
      state.podVoteIn.push(action.payload);
      toLocalStorage('podVoteIn', state.podVoteIn)
    }

  },
})

function toLocalStorage(store,user){
  localStorage.setItem(store, JSON.stringify(user));
}

// Action creators are generated for each case reducer function
export const { authenticate,logout, pod, addPodmMembers,desolvePod,podVoteIn } = UserSlice.actions
export default UserSlice.reducer

