import { Valuuta } from './ValuutaRequests';
import { apiSlice } from './apiSlice';

const VALUUTA_ENDPOINT_URL = 'http://localhost:8080/api/valuuta/';
const USER_ENDPOINT_URL = 'http://localhost:8080/api/auth/register';

export const adminSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllValuutas: builder.query<Valuuta[], void>({
      query: () => ({
        url: VALUUTA_ENDPOINT_URL, // Modify the URL as needed
        method: 'GET',
      }),
      keepUnusedDataFor: 1,
    }),
    loadValuutaData: builder.query<Valuuta[], void>({
      query: () => ({
        url: `${VALUUTA_ENDPOINT_URL}lae-andmed`, // Modify the URL as needed
        method: 'GET',
      }),
      keepUnusedDataFor: 1,
    }),
    updateValuuta: builder.mutation({
      query: (valuutad) => ({
        url: `${VALUUTA_ENDPOINT_URL}uuenda`,
        method: 'PUT',
        body: JSON.stringify(valuutad),
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
        },
      }),
    }),
    addUser: builder.mutation({
      query: (newUser) => ({
        url: USER_ENDPOINT_URL, // Modify the URL as needed
        method: 'POST', // Use POST for adding new data
        body: JSON.stringify(newUser),
        headers: {
          'Content-Type': 'application/json', // Set the Content-Type header to indicate JSON data
        },
      }),
    }),
  }),
});

export const {
  useGetAllValuutasQuery,
  useLoadValuutaDataQuery,
  useUpdateValuutaMutation,
  useAddUserMutation,
} = adminSlice;
