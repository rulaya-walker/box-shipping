import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosTokenInstance } from '../../axios/axiosInstance';

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  'stripe/createPaymentIntent',
  async ({ checkoutId, currency = 'usd' }, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(
        '/api/stripe/create-payment-intent',
        { checkoutId, currency }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create payment intent'
      );
    }
  }
);

// Confirm payment
export const confirmPayment = createAsyncThunk(
  'stripe/confirmPayment',
  async (paymentIntentId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(
        '/api/stripe/confirm-payment',
        { paymentIntentId }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to confirm payment'
      );
    }
  }
);

// Get payment status
export const getPaymentStatus = createAsyncThunk(
  'stripe/getPaymentStatus',
  async (paymentIntentId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.get(
        `/api/stripe/payment-status/${paymentIntentId}`
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to get payment status'
      );
    }
  }
);

// Cancel payment
export const cancelPayment = createAsyncThunk(
  'stripe/cancelPayment',
  async (paymentIntentId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(
        '/api/stripe/cancel-payment',
        { paymentIntentId }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel payment'
      );
    }
  }
);

// Finalize checkout and create order
export const finalizeCheckout = createAsyncThunk(
  'stripe/finalizeCheckout',
  async (checkoutId, { rejectWithValue }) => {
    try {
      const response = await axiosTokenInstance.post(
        '/api/stripe/finalize-checkout',
        { checkoutId }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to finalize checkout'
      );
    }
  }
);

// Initial state
const initialState = {
  // Payment intent data
  clientSecret: null,
  paymentIntentId: null,
  amount: null,
  currency: 'usd',
  
  // Payment status
  paymentStatus: null,
  checkout: null,
  
  // Loading states
  isCreatingPaymentIntent: false,
  isConfirmingPayment: false,
  isGettingStatus: false,
  isCancellingPayment: false,
  isFinalizingCheckout: false,
  
  // Error states
  createPaymentIntentError: null,
  confirmPaymentError: null,
  paymentStatusError: null,
  cancelPaymentError: null,
  finalizeCheckoutError: null,
  
  // General state
  isLoading: false,
  error: null,
  success: false,
  
  // Payment flow state
  paymentStep: 'idle', // 'idle', 'creating', 'processing', 'succeeded', 'failed', 'cancelled'
};

const stripeSlice = createSlice({
  name: 'stripe',
  initialState,
  reducers: {
    // Reset stripe state
    resetStripeState: (state) => {
      return { ...initialState };
    },
    
    // Clear errors
    clearStripeErrors: (state) => {
      state.createPaymentIntentError = null;
      state.confirmPaymentError = null;
      state.paymentStatusError = null;
      state.cancelPaymentError = null;
      state.finalizeCheckoutError = null;
      state.error = null;
    },
    
    // Set payment step
    setPaymentStep: (state, action) => {
      state.paymentStep = action.payload;
    },
    
    // Update payment status manually (for real-time updates)
    updatePaymentStatus: (state, action) => {
      state.paymentStatus = action.payload;
    },
    
    // Reset success state
    resetSuccess: (state) => {
      state.success = false;
    },
    
    // Set client secret manually (useful for handling Stripe Elements)
    setClientSecret: (state, action) => {
      state.clientSecret = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Payment Intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isCreatingPaymentIntent = true;
        state.isLoading = true;
        state.createPaymentIntentError = null;
        state.paymentStep = 'creating';
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isCreatingPaymentIntent = false;
        state.isLoading = false;
        state.clientSecret = action.payload.clientSecret;
        state.paymentIntentId = action.payload.paymentIntentId;
        state.amount = action.payload.amount;
        state.currency = action.payload.currency;
        state.paymentStep = 'processing';
        state.success = true;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isCreatingPaymentIntent = false;
        state.isLoading = false;
        state.createPaymentIntentError = action.payload;
        state.error = action.payload;
        state.paymentStep = 'failed';
      })
      
      // Confirm Payment
      .addCase(confirmPayment.pending, (state) => {
        state.isConfirmingPayment = true;
        state.isLoading = true;
        state.confirmPaymentError = null;
      })
      .addCase(confirmPayment.fulfilled, (state, action) => {
        state.isConfirmingPayment = false;
        state.isLoading = false;
        state.checkout = action.payload.checkout;
        state.paymentStatus = action.payload.paymentStatus;
        state.paymentStep = 'succeeded';
        state.success = true;
      })
      .addCase(confirmPayment.rejected, (state, action) => {
        state.isConfirmingPayment = false;
        state.isLoading = false;
        state.confirmPaymentError = action.payload;
        state.error = action.payload;
        state.paymentStep = 'failed';
      })
      
      // Get Payment Status
      .addCase(getPaymentStatus.pending, (state) => {
        state.isGettingStatus = true;
        state.paymentStatusError = null;
      })
      .addCase(getPaymentStatus.fulfilled, (state, action) => {
        state.isGettingStatus = false;
        state.paymentStatus = action.payload.status;
        state.checkout = action.payload.checkout;
        
        // Update payment step based on status
        if (action.payload.status === 'succeeded') {
          state.paymentStep = 'succeeded';
        } else if (action.payload.status === 'canceled') {
          state.paymentStep = 'cancelled';
        } else if (action.payload.status === 'requires_payment_method') {
          state.paymentStep = 'failed';
        }
      })
      .addCase(getPaymentStatus.rejected, (state, action) => {
        state.isGettingStatus = false;
        state.paymentStatusError = action.payload;
        state.error = action.payload;
      })
      
      // Cancel Payment
      .addCase(cancelPayment.pending, (state) => {
        state.isCancellingPayment = true;
        state.isLoading = true;
        state.cancelPaymentError = null;
      })
      .addCase(cancelPayment.fulfilled, (state, action) => {
        state.isCancellingPayment = false;
        state.isLoading = false;
        state.paymentStatus = action.payload.paymentStatus;
        state.paymentStep = 'cancelled';
        state.success = true;
      })
      .addCase(cancelPayment.rejected, (state, action) => {
        state.isCancellingPayment = false;
        state.isLoading = false;
        state.cancelPaymentError = action.payload;
        state.error = action.payload;
      })
      
      // Finalize Checkout
      .addCase(finalizeCheckout.pending, (state) => {
        state.isFinalizingCheckout = true;
        state.isLoading = true;
        state.finalizeCheckoutError = null;
      })
      .addCase(finalizeCheckout.fulfilled, (state, action) => {
        state.isFinalizingCheckout = false;
        state.isLoading = false;
        state.paymentStep = 'succeeded';
        state.success = true;
      })
      .addCase(finalizeCheckout.rejected, (state, action) => {
        state.isFinalizingCheckout = false;
        state.isLoading = false;
        state.finalizeCheckoutError = action.payload;
        state.error = action.payload;
      });
  },
});

// Export actions
export const {
  resetStripeState,
  clearStripeErrors,
  setPaymentStep,
  updatePaymentStatus,
  resetSuccess,
  setClientSecret,
} = stripeSlice.actions;

// Selectors
export const selectStripeState = (state) => state.stripe;
export const selectClientSecret = (state) => state.stripe.clientSecret;
export const selectPaymentIntentId = (state) => state.stripe.paymentIntentId;
export const selectPaymentStatus = (state) => state.stripe.paymentStatus;
export const selectPaymentStep = (state) => state.stripe.paymentStep;
export const selectIsLoading = (state) => state.stripe.isLoading;
export const selectStripeErrors = (state) => ({
  createPaymentIntentError: state.stripe.createPaymentIntentError,
  confirmPaymentError: state.stripe.confirmPaymentError,
  paymentStatusError: state.stripe.paymentStatusError,
  cancelPaymentError: state.stripe.cancelPaymentError,
  finalizeCheckoutError: state.stripe.finalizeCheckoutError,
  general: state.stripe.error,
});

export default stripeSlice.reducer;
