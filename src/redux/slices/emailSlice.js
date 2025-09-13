import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {axiosInstance} from '../../axios/axiosInstance';

// Send order details email to user and admin
export const sendOrderDetailsEmail = createAsyncThunk(
  'email/sendOrderDetailsEmail',
  async ({ order, userEmail, userName }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/api/email/order-details', {
        order,
        userEmail,
        userName,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const emailSlice = createSlice({
  name: 'email',
  initialState: {
    loading: false,
    error: null,
    success: false,
    response: null,
  },
  reducers: {
    resetEmailState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.response = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOrderDetailsEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(sendOrderDetailsEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.response = action.payload;
      })
      .addCase(sendOrderDetailsEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetEmailState } = emailSlice.actions;
export default emailSlice.reducer;
