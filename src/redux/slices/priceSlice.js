import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosTokenInstance } from '../../axios/axiosInstance';

// Get price by country
export const getPriceByCountry = createAsyncThunk('prices/getPriceByCountry', async (country) => {
  const response = await axiosTokenInstance.get(`/api/prices/${encodeURIComponent(country)}`);
  return response.data;
});
export const getPrices = createAsyncThunk('prices/getPrices', async () => {
  const response = await axiosTokenInstance.get('/api/prices');
  return response.data;
});

export const addPrice = createAsyncThunk('prices/addPrice', async (priceData) => {
  const response = await axiosTokenInstance.post('/api/prices', priceData);
  return response.data;
});

export const updatePrice = createAsyncThunk('prices/updatePrice', async ({ id, priceData }) => {
  const response = await axiosTokenInstance.put(`/api/prices/${id}`, priceData);
  return response.data;
});

export const deletePrice = createAsyncThunk('prices/deletePrice', async (id) => {
  await axiosTokenInstance.delete(`/api/prices/${id}`);
  return id;
});

const priceSlice = createSlice({
  name: 'prices',
  initialState: {
    prices: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPrices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPrices.fulfilled, (state, action) => {
        state.loading = false;
        state.prices = action.payload;
      })
      .addCase(getPrices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPrice.fulfilled, (state, action) => {
        state.prices.push(action.payload);
      })
      .addCase(updatePrice.fulfilled, (state, action) => {
        const idx = state.prices.findIndex(p => p._id === action.payload._id);
        if (idx !== -1) state.prices[idx] = action.payload;
      })
      .addCase(deletePrice.fulfilled, (state, action) => {
        state.prices = state.prices.filter(p => p._id !== action.payload);
      })
      .addCase(getPriceByCountry.pending, (state) => {
        state.loading = true;
         
        state.error = null;
      })
      .addCase(getPriceByCountry.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCountryPrice = action.payload;
      })
      .addCase(getPriceByCountry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      
  },
});

export default priceSlice.reducer;
