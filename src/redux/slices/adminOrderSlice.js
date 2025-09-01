import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTokenInstance } from "../../axios/axiosInstance";

export const fetchAdminOrders = createAsyncThunk(
  "adminOrder/fetchAdminOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.get("/api/admin/orders");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


export const updateOrderStatus = createAsyncThunk(
  "adminOrder/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.put(`/api/admin/orders/${id}/status`, { status });
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteOrder = createAsyncThunk(
  "adminOrder/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
   await axiosTokenInstance.delete(`/api/admin/orders/${id}`);
      return id; // Return the order ID for deletion
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    adminOrders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure action.payload is an array
        state.adminOrders = Array.isArray(action.payload) ? action.payload : [];
        state.totalOrders = state.adminOrders.length;
        // Safely calculate total sales with fallback for missing totalPrice
        state.totalSales = state.adminOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);
      })
      .addCase(fetchAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch orders";
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.adminOrders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.adminOrders[index] = action.payload; // Update the order in the list
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to update order status";
      })
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.adminOrders = state.adminOrders.filter(order => order._id !== action.payload); // Remove the deleted order
        // Recalculate totals after deletion
        state.totalOrders = state.adminOrders.length;
        state.totalSales = state.adminOrders.reduce((acc, order) => acc + order.totalPrice, 0);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to delete order";
      });
  },
});

export default adminOrderSlice.reducer;