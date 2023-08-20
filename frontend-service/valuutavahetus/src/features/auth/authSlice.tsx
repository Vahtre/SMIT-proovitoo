import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'login',
  initialState: { user: null, token: null, refreshToken: null },
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
    },
    logOut: (state, action) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setCredentials, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: any) => state.auth.user;
export const selectCurrentToken = (state: any) => state.auth.token;

export function getHeaders() {
  const token = localStorage.getItem('token');
  if (token && token !== 'undefined') {
    return {
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer' + token,
    };
  } else {
    return {
      'Access-Control-Allow-Origin': '*',
    };
  }
}
