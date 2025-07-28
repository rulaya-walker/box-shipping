import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ orderDetails, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // Debug logging
  console.log('CheckoutForm received orderDetails:', orderDetails);
  
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      postal_code: '',
      country: 'US'
    }
  });

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

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone,
          address: customerInfo.address
        }
      });

      if (paymentMethodError) {
        setPaymentError(paymentMethodError.message);
        setIsLoading(false);
        return;
      }

      // In a real application, you would send this to your backend
      // For demo purposes, we'll simulate a successful payment
      setTimeout(() => {
        setPaymentSuccess(true);
        setIsLoading(false);
        onPaymentSuccess && onPaymentSuccess({
          paymentMethod,
          orderDetails,
          customerInfo
        });
      }, 2000);

    } catch (error) {
      setPaymentError(error.message);
      setIsLoading(false);
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
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: false,
  };

  if (paymentSuccess) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
          <p className="text-gray-600">Your shipment has been booked successfully.</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Confirmation will be sent to:</p>
          <p className="font-semibold text-gray-800">{customerInfo.email}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Book Another Shipment
        </button>
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
            <span>${orderDetails?.cartTotal || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping ({orderDetails?.selectedService || 'Express'}):</span>
            <span>${orderDetails?.shippingCost || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Destination Charges:</span>
            <span>${orderDetails?.destinationCharges || '0.00'}</span>
          </div>
          <div className="flex justify-between">
            <span>Processing Fee:</span>
            <span>${orderDetails?.processingFee || '0.00'}</span>
          </div>
          <hr className="my-2" />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total:</span>
            <span className="text-blue-600">${orderDetails?.totalAmount || '0.00'}</span>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                Postal Code *
              </label>
              <input
                type="text"
                required
                value={customerInfo.address.postal_code}
                onChange={(e) => handleCustomerInfoChange('address.postal_code', e.target.value)}
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
          disabled={!stripe || isLoading}
          className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-colors ${
            !stripe || isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing Payment...
            </div>
          ) : (
            `Pay $${orderDetails?.totalAmount || '0.00'} Now`
          )}
        </button>

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
