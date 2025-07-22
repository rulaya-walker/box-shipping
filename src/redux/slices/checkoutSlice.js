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


const checkoutSlice = createSlice({
  name: "checkout",
  initialState: {
    checkout: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCheckout: (state) => {
      state.checkout = null;
      state.loading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  },
});

export const { resetCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;