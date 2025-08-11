import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { axiosTokenInstance } from "../../axios/axiosInstance";

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching user orders from API...');
      const response = await axiosTokenInstance.get(`/api/orders/my-orders`);
      console.log('fetchUserOrders response:', response.data);
      return response.data;
    } catch (error) {
      console.error('fetchUserOrders error:', error);
      console.error('Error response:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      console.log('fetchOrderById called with orderId:', orderId);
      const response = await axiosTokenInstance.get(`/api/orders/${orderId}`);
      console.log('fetchOrderById response:', response.data);
      console.log('fetchOrderById response status:', response.status);
      return response.data;
    } catch (error) {
      console.error('fetchOrderById error:', error);
      console.error('fetchOrderById error response:', error.response?.data);
      console.error('fetchOrderById error status:', error.response?.status);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Create order from checkout
export const createOrderFromCheckout = createAsyncThunk(
  "order/createOrderFromCheckout",
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(`/api/orders/create-from-checkout`, {
        checkoutId: checkoutId
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update order status (admin only)
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.put(`/api/orders/${orderId}/status`, {
        status: status
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    orderDetails: null,
    loading: false,
    error: null,
    // Order creation states
    isCreatingOrder: false,
    createOrderError: null,
    newOrder: null,
    // Order update states
    isUpdatingOrder: false,
    updateOrderError: null,
  },
  reducers: {
    clearOrderErrors: (state) => {
      state.error = null;
      state.createOrderError = null;
      state.updateOrderError = null;
    },
    clearNewOrder: (state) => {
      state.newOrder = null;
    },
    resetOrderState: (state) => {
      state.orderDetails = null;
      state.newOrder = null;
      state.error = null;
      state.createOrderError = null;
      state.updateOrderError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders || action.payload;
        state.totalOrders = action.payload.count || action.payload.length;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.orderDetails = action.payload.order || action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch order";
      })
      // Create order from checkout
      .addCase(createOrderFromCheckout.pending, (state) => {
        state.isCreatingOrder = true;
        state.createOrderError = null;
      })
      .addCase(createOrderFromCheckout.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.newOrder = action.payload.order;
        // Add new order to the orders list
        state.orders.unshift(action.payload.order);
        state.totalOrders += 1;
      })
      .addCase(createOrderFromCheckout.rejected, (state, action) => {
        state.isCreatingOrder = false;
        state.createOrderError = action.payload?.message || "Failed to create order";
      })
      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdatingOrder = true;
        state.updateOrderError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdatingOrder = false;
        const updatedOrder = action.payload.order;
        // Update order in the orders list
        const orderIndex = state.orders.findIndex(order => order._id === updatedOrder._id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = updatedOrder;
        }
        // Update order details if it's the currently viewed order
        if (state.orderDetails && state.orderDetails._id === updatedOrder._id) {
          state.orderDetails = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdatingOrder = false;
        state.updateOrderError = action.payload?.message || "Failed to update order status";
      });
  },
});

export const { clearOrderErrors, clearNewOrder, resetOrderState } = orderSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectOrderDetails = (state) => state.orders.orderDetails;
export const selectNewOrder = (state) => state.orders.newOrder;
export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderCreating = (state) => state.orders.isCreatingOrder;
export const selectOrderUpdating = (state) => state.orders.isUpdatingOrder;
export const selectOrderErrors = (state) => ({
  general: state.orders.error,
  create: state.orders.createOrderError,
  update: state.orders.updateOrderError,
});

export default orderSlice.reducer;