import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTokenInstance } from "../../axios/axiosInstance";

export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async (checkoutData, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post("/api/checkout", checkoutData);

      console.log("Checkout response:", response.data);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error(response.data.message);
      }
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const payCheckout = createAsyncThunk(
  "checkout/payCheckout",
  async ({ checkoutId, paymentStatus, paymentDetails, collectionDate }, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.put(`/api/checkout/${checkoutId}/pay`, {
        paymentStatus,
        paymentDetails,
        collectionDate
      });

      console.log("Pay checkout response:", response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const finalizeCheckout = createAsyncThunk(
  "checkout/finalizeCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(`/api/checkout/${checkoutId}/finalize`);

      console.log("Finalize checkout response:", response.data);
      return response.data;
      
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
    paymentLoading: false,
    paymentError: null,
    finalizeLoading: false,
    finalizeError: null,
    finalizedOrder: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.checkout = null;
      state.loading = false;
      state.error = null;
      state.paymentLoading = false;
      state.paymentError = null;
      state.finalizeLoading = false;
      state.finalizeError = null;
      state.finalizedOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create checkout
      .addCase(createCheckout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.checkout = action.payload;
      })
      .addCase(createCheckout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create checkout";
      })
      // Pay checkout
      .addCase(payCheckout.pending, (state) => {
        state.paymentLoading = true;
        state.paymentError = null;
      })
      .addCase(payCheckout.fulfilled, (state, action) => {
        state.paymentLoading = false;
        state.checkout = action.payload; // Update checkout with payment info
      })
      .addCase(payCheckout.rejected, (state, action) => {
        state.paymentLoading = false;
        state.paymentError = action.payload?.message || "Failed to process payment";
      })
      // Finalize checkout
      .addCase(finalizeCheckout.pending, (state) => {
        state.finalizeLoading = true;
        state.finalizeError = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.finalizeLoading = false;
        state.finalizedOrder = action.payload.order;
        // Mark checkout as finalized
        if (state.checkout) {
          state.checkout.isFinalized = true;
          state.checkout.finalizedAt = new Date().toISOString();
        }
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.finalizeLoading = false;
        state.finalizeError = action.payload?.message || "Failed to finalize checkout";
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;