import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  cancelPayment,
  clearStripeErrors,
  resetStripeState,
  setPaymentStep,
  selectStripeState,
  selectClientSecret,
  selectPaymentIntentId,
  selectPaymentStatus,
  selectPaymentStep,
  selectIsLoading,
  selectStripeErrors,
} from '../redux/slices/stripeSlice';

/**
 * Custom hook for Stripe payment operations
 * Provides easy access to Stripe actions and state
 */
export const useStripe = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const stripeState = useSelector(selectStripeState);
  const clientSecret = useSelector(selectClientSecret);
  const paymentIntentId = useSelector(selectPaymentIntentId);
  const paymentStatus = useSelector(selectPaymentStatus);
  const paymentStep = useSelector(selectPaymentStep);
  const isLoading = useSelector(selectIsLoading);
  const errors = useSelector(selectStripeErrors);

  // Actions
  const actions = {
    createPaymentIntent: useCallback(
      (data) => dispatch(createPaymentIntent(data)),
      [dispatch]
    ),
    
    confirmPayment: useCallback(
      (paymentIntentId) => dispatch(confirmPayment(paymentIntentId)),
      [dispatch]
    ),
    
    getPaymentStatus: useCallback(
      (paymentIntentId) => dispatch(getPaymentStatus(paymentIntentId)),
      [dispatch]
    ),
    
    cancelPayment: useCallback(
      (paymentIntentId) => dispatch(cancelPayment(paymentIntentId)),
      [dispatch]
    ),
    
    clearErrors: useCallback(
      () => dispatch(clearStripeErrors()),
      [dispatch]
    ),
    
    resetState: useCallback(
      () => dispatch(resetStripeState()),
      [dispatch]
    ),
    
    setStep: useCallback(
      (step) => dispatch(setPaymentStep(step)),
      [dispatch]
    ),
  };

  // Computed values
  const computed = {
    hasError: Boolean(
      errors.createPaymentIntentError ||
      errors.confirmPaymentError ||
      errors.paymentStatusError ||
      errors.cancelPaymentError ||
      errors.general
    ),
    
    isPending: stripeState.isCreatingPaymentIntent || stripeState.isConfirmingPayment,
    
    isSuccess: paymentStatus === 'succeeded',
    
    isReady: Boolean(clientSecret && !isLoading),
    
    canRetry: paymentStep === 'failed' || Boolean(errors.general),
    
    needsAction: paymentStatus === 'requires_action' || paymentStatus === 'requires_confirmation',
  };

  return {
    // State
    ...stripeState,
    clientSecret,
    paymentIntentId,
    paymentStatus,
    paymentStep,
    isLoading,
    errors,
    
    // Actions
    ...actions,
    
    // Computed
    ...computed,
  };
};

/**
 * Hook for creating a payment flow
 * Handles the complete payment process
 */
export const usePaymentFlow = () => {
  const stripe = useStripe();
  
  const startPayment = useCallback(async (checkoutId, options = {}) => {
    try {
      stripe.clearErrors();
      stripe.setStep('creating');
      
      const result = await stripe.createPaymentIntent({
        checkoutId,
        currency: options.currency || 'usd',
      });
      
      if (createPaymentIntent.fulfilled.match(result)) {
        stripe.setStep('processing');
        return { success: true, data: result.payload };
      } else {
        stripe.setStep('failed');
        return { success: false, error: result.payload };
      }
    } catch (error) {
      stripe.setStep('failed');
      return { success: false, error: error.message };
    }
  }, [stripe]);

  const completePayment = useCallback(async (paymentIntentId) => {
    try {
      const result = await stripe.confirmPayment(paymentIntentId);
      
      if (confirmPayment.fulfilled.match(result)) {
        stripe.setStep('succeeded');
        return { success: true, data: result.payload };
      } else {
        stripe.setStep('failed');
        return { success: false, error: result.payload };
      }
    } catch (error) {
      stripe.setStep('failed');
      return { success: false, error: error.message };
    }
  }, [stripe]);

  const cancelCurrentPayment = useCallback(async () => {
    if (!stripe.paymentIntentId) {
      return { success: false, error: 'No payment to cancel' };
    }

    try {
      const result = await stripe.cancelPayment(stripe.paymentIntentId);
      
      if (cancelPayment.fulfilled.match(result)) {
        stripe.setStep('cancelled');
        return { success: true, data: result.payload };
      } else {
        return { success: false, error: result.payload };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, [stripe]);

  const retryPayment = useCallback(() => {
    stripe.clearErrors();
    stripe.setStep('idle');
  }, [stripe]);

  return {
    ...stripe,
    startPayment,
    completePayment,
    cancelCurrentPayment,
    retryPayment,
  };
};

export default useStripe;
