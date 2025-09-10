import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { 
  createPaymentIntent, 
  confirmPayment, 
  clearStripeErrors, 
  resetStripeState 
} from '../redux/slices/stripeSlice';
import { createCheckout, payCheckout, finalizeCheckout } from '../redux/slices/checkoutSlice';
import { clearCart } from '../redux/slices/cartSlice';


// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Redux state
  const { user, token } = useSelector(state => state.auth);
  const orderState = useSelector(state => state.orders);
  
  // Local state
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState('payment'); // payment, processing, success
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    }
  });

  // Clear errors when component mounts
  useEffect(() => {
    dispatch(clearStripeErrors());
  }, [dispatch]);

  const handleCustomerInfoChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setCustomerInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setCustomerInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setPaymentError(null);
    setCurrentStep('processing');

    if (!stripe || !elements) {
      setIsLoading(false);
      setCurrentStep('payment');
      return;
    }

    if (!user || !token) {
      setPaymentError('Please log in to complete your purchase');
      setIsLoading(false);
      setCurrentStep('payment');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Step 1: Create payment method
      console.log('Step 1: Creating payment method...');
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address.line1,
            city: customerInfo.address.city,
            state: customerInfo.address.state,
            postal_code: customerInfo.address.zip,
            country: customerInfo.address.country
          }
        }
      });

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message);
      }

      console.log('Payment method created successfully:', paymentMethod.id);

      // Step 2: Create checkout in backend
      console.log('Step 2: Creating checkout...');
      const checkoutData = {
        checkoutItems: orderDetails.cartItems?.map(item => ({
          productId: item.productId || item.id || item._id,
          name: item.name || 'Product',
          image: item.image || '',
          price: parseFloat(item.price) || 0,
          quantity: parseInt(item.quantity) || 1,
          size: item.size || 'M'
        })) || [],
        shippingAddress: {
          address: customerInfo.address.line1,
          city: customerInfo.address.city,
          state: customerInfo.address.state,
          zip: customerInfo.address.zip,
          country: customerInfo.address.country
        },
        paymentMethod: 'stripe',
        totalPrice: parseFloat(orderDetails.totalAmount || 0)
      };

      const checkoutResult = await dispatch(createCheckout(checkoutData));
      
      if (createCheckout.rejected.match(checkoutResult)) {
        throw new Error(checkoutResult.payload?.message || 'Failed to create checkout');
      }

      const checkoutId = checkoutResult.payload._id;
      console.log('Checkout created successfully:', checkoutId);

      // Step 3: Create payment intent
      console.log('Step 3: Creating payment intent...');
      const paymentIntentResult = await dispatch(createPaymentIntent({ 
        checkoutId, 
        currency: 'usd' 
      }));
      
      if (createPaymentIntent.rejected.match(paymentIntentResult)) {
        throw new Error(paymentIntentResult.payload || 'Failed to create payment intent');
      }

      const { clientSecret } = paymentIntentResult.payload;
      console.log('Payment intent created successfully');

      // Step 4: Confirm payment with Stripe
      console.log('Step 4: Confirming payment with Stripe...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      const payResult = await dispatch(payCheckout({
        checkoutId,
        paymentStatus: 'Paid', // Fixed case sensitivity - backend expects 'Paid' not 'paid'
        paymentDetails: {
          paymentIntentId: paymentIntent.id,
          paymentMethodId: paymentMethod.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          email: customerInfo.email,
          phone: customerInfo.phone
        }
      }));
      
      if (payCheckout.rejected.match(payResult)) {
        throw new Error(payResult.payload?.message || 'Failed to update payment status');
      }

      console.log('Payment status updated successfully');

      // Step 6: Finalize checkout (this creates the order)
      console.log('Step 6: Finalizing checkout and creating order...');
      const finalizeResult = await dispatch(finalizeCheckout(checkoutId));
      
      if (finalizeCheckout.rejected.match(finalizeResult)) {
        throw new Error(finalizeResult.payload?.message || 'Failed to finalize checkout');
      }

      console.log('Checkout finalized and order created successfully');
      const newOrder = finalizeResult.payload.order; // Order comes from finalize, not separate step

      // Step 7: Clear cart
      dispatch(clearCart());

      // Success!
      setPaymentSuccess(true);
      setCurrentStep('success');
      setIsLoading(false);

    // Remove toCountry from localStorage after successful checkout
    localStorage.removeItem('toCountry');

      // Call success callback
      onPaymentSuccess && onPaymentSuccess({
        paymentIntent,
        paymentMethod,
        order: newOrder,
        checkout: finalizeResult.payload,
        orderDetails,
        customerInfo
      });

      // Redirect to order details after a short delay
  navigate(`/user/orders/${newOrder._id}`);

    } catch (error) {
      console.error('Payment workflow error:', error);
      setPaymentError(error.message || 'Payment failed. Please try again.');
      setIsLoading(false);
      setCurrentStep('payment');
      onPaymentError && onPaymentError(error);
    }
  };

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

  if (paymentSuccess || currentStep === 'success') {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your order has been created and payment processed successfully.</p>
        </div>
        
        {orderState.newOrder && (
          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-700 font-medium">Order Created</p>
            <p className="text-lg text-green-800 font-semibold">#{orderState.newOrder._id}</p>
          </div>
        )}
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Confirmation will be sent to:</p>
          <p className="font-semibold text-gray-800">{customerInfo.email}</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            🔄 Redirecting to order details in 3 seconds...
          </p>
        </div>
        
        <div className="space-y-3">
          {orderState.newOrder && (
            <button 
              onClick={() => navigate(`/user/orders/${orderState.newOrder._id}`)}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Order Details
            </button>
          )}
          <button 
            onClick={() => navigate('/')} 
            className="w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Book Another Shipment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Complete Your Payment</h2>
        <p className="text-gray-600">Secure payment powered by Stripe</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Cart Items ({orderDetails?.cartItems?.length || 0}):</span>
            <span>${orderDetails?.totalAmount || '0.00'}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-semibold text-lg">
              
              <span>Total:</span>
              <span className="text-blue-600">${orderDetails?.totalAmount || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Customer Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Billing Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={customerInfo.name}
                onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={customerInfo.email}
                onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={customerInfo.phone}
              onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address Line 1 *
            </label>
            <input
              type="text"
              required
              value={customerInfo.address.line1}
              onChange={(e) => handleCustomerInfoChange('address.line1', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                required
                value={customerInfo.address.city}
                onChange={(e) => handleCustomerInfoChange('address.city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="New York"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <input
                type="text"
                required
                value={customerInfo.address.state}
                onChange={(e) => handleCustomerInfoChange('address.state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="NY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code *
              </label>
              <input
                type="text"
                required
                value={customerInfo.address.zip}
                onChange={(e) => handleCustomerInfoChange('address.zip', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="10001"
              />
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-6">
          <h3 className="font-semibold text-gray-800 mb-4">Payment Information</h3>
          
          <div className="border border-gray-300 rounded-lg p-4 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Details *
            </label>
            <CardElement options={cardElementOptions} />
          </div>
        </div>

        {/* Security Features */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 text-blue-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium">Secure Payment</span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Your payment information is encrypted and secure. We use industry-standard SSL encryption.
          </p>
        </div>

        {/* Error Display */}
        {paymentError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Payment Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{paymentError}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!stripe || isLoading || !user || !token}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-colors cursor-pointer ${
            !stripe || isLoading || !user || !token
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary hover:bg-primary/50'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {currentStep === 'processing' ? 'Processing Payment & Creating Order...' : 'Processing Payment...'}
            </div>
          ) : !user || !token ? (
            'Please Log In to Continue'
          ) : (
            `Pay $${orderDetails?.totalAmount || '0.00'} Now`
          )}
        </button>
        
        {/* Processing Steps Indicator */}
        {currentStep === 'processing' && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-800 mb-2">
              <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 718-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 714 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm font-medium">Processing your order...</span>
            </div>
            <p className="text-xs text-blue-700">
              Please wait while we process your payment and create your order. This may take a few moments.
            </p>
          </div>
        )}

        {/* Authentication Warning */}
        {(!user || !token) && (
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Login Required</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Please log in to your account to complete the payment and create your order.
            </p>
          </div>
        )}

        {/* Terms and Conditions */}
        <p className="text-xs text-gray-500 text-center mt-4">
          By clicking "Pay Now", you agree to our{' '}
          <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
        </p>
      </form>
    </div>
  );
};

const StripePayment = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <CheckoutForm 
            orderDetails={orderDetails}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </div>
      </div>
    </Elements>
  );
};

export default StripePayment;
