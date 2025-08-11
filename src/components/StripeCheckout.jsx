import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import {
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  cancelPayment,
  finalizeCheckout,
  clearStripeErrors,
  resetStripeState,
  setPaymentStep,
  selectStripeState,
} from '../redux/slices/stripeSlice';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card Element options
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
  hidePostalCode: false,
};

// Payment Form Component
const PaymentForm = ({ checkoutId, onSuccess, onError }) => {
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  
  const {
    clientSecret,
    paymentIntentId,
    amount,
    currency,
    paymentStep,
    isCreatingPaymentIntent,
    isConfirmingPayment,
    createPaymentIntentError,
    confirmPaymentError,
  } = useSelector(selectStripeState);

  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  // Create payment intent when component mounts
  useEffect(() => {
    if (checkoutId && !clientSecret) {
      dispatch(createPaymentIntent({ checkoutId }));
    }
  }, [checkoutId, clientSecret, dispatch]);

  // Handle card element changes
  const handleCardChange = (event) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);
    setCardError(null);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      if (error) {
        setCardError(error.message);
        dispatch(setPaymentStep('failed'));
        onError?.(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend
        const result = await dispatch(confirmPayment(paymentIntent.id));
        
        if (confirmPayment.fulfilled.match(result)) {
          dispatch(setPaymentStep('succeeded'));
          
          // Try to finalize checkout automatically
          try {
            const finalizeResult = await dispatch(finalizeCheckout(checkoutId));
            if (finalizeCheckout.fulfilled.match(finalizeResult)) {
              console.log('Order created successfully:', finalizeResult.payload);
            }
          } catch (finalizeError) {
            console.error('Error finalizing checkout:', finalizeError);
            // Don't fail the payment flow if finalization fails
          }
          
          onSuccess?.(result.payload);
        } else {
          const errorMessage = result.payload || 'Payment confirmation failed';
          setCardError(errorMessage);
          onError?.(errorMessage);
        }
      }
    } catch (err) {
      setCardError('An unexpected error occurred');
      onError?.(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle payment cancellation
  const handleCancel = () => {
    if (paymentIntentId) {
      dispatch(cancelPayment(paymentIntentId));
    }
    dispatch(resetStripeState());
  };

  // Display error messages
  const errorMessage = cardError || createPaymentIntentError || confirmPaymentError;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Payment</h2>
      
      {/* Payment Amount */}
      {amount && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Amount to pay:</p>
          <p className="text-lg font-semibold">
            ${(amount / 100).toFixed(2)} {currency.toUpperCase()}
          </p>
        </div>
      )}

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Card Element */}
        <div className="border border-gray-300 rounded-md p-3">
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        </div>

        {/* Error Messages */}
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3">
            <p className="text-sm text-red-600">{errorMessage}</p>
          </div>
        )}

        {/* Payment Status */}
        {paymentStep === 'creating' && (
          <div className="text-center text-blue-600">
            Creating payment intent...
          </div>
        )}

        {paymentStep === 'succeeded' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <p className="text-sm text-green-600">Payment successful!</p>
          </div>
        )}

        {paymentStep === 'cancelled' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-600">Payment cancelled</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={
              !stripe || 
              !clientSecret || 
              isProcessing || 
              isCreatingPaymentIntent || 
              isConfirmingPayment ||
              paymentStep === 'succeeded'
            }
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing || isConfirmingPayment ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Pay Now'
            )}
          </button>

          <button
            type="button"
            onClick={handleCancel}
            disabled={isProcessing || isConfirmingPayment}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// Main Stripe Checkout Component
const StripeCheckout = ({ checkoutId, onSuccess, onError, onCancel }) => {
  const dispatch = useDispatch();

  // Reset stripe state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetStripeState());
    };
  }, [dispatch]);

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearStripeErrors());
  }, [dispatch]);

  const handleSuccess = (paymentData) => {
    onSuccess?.(paymentData);
  };

  const handleError = (error) => {
    onError?.(error);
  };

  if (!checkoutId) {
    return (
      <div className="text-center text-red-600">
        No checkout ID provided
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        checkoutId={checkoutId}
        onSuccess={handleSuccess}
        onError={handleError}
      />
    </Elements>
  );
};

export default StripeCheckout;
