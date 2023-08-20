import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setCredentials, logOut } from 'src/features/auth/authSlice';
import { RootState } from './store';

const ENDPOINT_URL = 'http://localhost:8080/api/auth/';

let addToken = true; //need this because BE wants to validate old accessToken

const baseQuery = fetchBaseQuery({
  baseUrl: ENDPOINT_URL,
  prepareHeaders: (headers, { getState }) => {
    const state: RootState = getState() as RootState;
    const token = state.auth.token;
    if (token && addToken) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    addToken = false;
    //send refresh token

    const refreshResult = await baseQuery(
      {
        url: 'token',
        method: 'POST',
        body: api.getState().auth.refreshToken,
      },
      api,
      extraOptions,
    );
    addToken = true;
    if (refreshResult?.data) {
      const user = api.getState().auth.user;
      //store new token
      api.dispatch(setCredentials({ ...refreshResult.data, user }));
      //retry original query with new access token
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logOut(''));
    }
  }
  return result;
};

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    // Define your endpoints here
  }),
});
