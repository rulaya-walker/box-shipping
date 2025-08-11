import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import StripeCheckout from '../components/StripeCheckout';
import PaymentStatus from '../components/PaymentStatus';
import { selectStripeState } from '../redux/slices/stripeSlice';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { checkoutId } = useParams();
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const [completedPayment, setCompletedPayment] = useState(null);
  
  const { paymentIntentId, paymentStep } = useSelector(selectStripeState);

  // Check if user is authenticated
  const { user, token } = useSelector((state) => state.auth);
  
  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handlePaymentSuccess = (paymentData) => {
    setCompletedPayment(paymentData);
    setShowPaymentStatus(true);
    
    // Optionally redirect after success
    setTimeout(() => {
      navigate('/orders');
    }, 3000);
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    // Handle error (show notification, etc.)
  };

  const handlePaymentCancel = () => {
    navigate('/cart');
  };

  if (!checkoutId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Checkout</h1>
          <p className="text-gray-600 mb-4">No checkout ID was provided.</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your payment securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            {!showPaymentStatus ? (
              <StripeCheckout
                checkoutId={checkoutId}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                onCancel={handlePaymentCancel}
              />
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-green-600 mb-4">
                  Payment Completed!
                </h2>
                <p className="text-gray-600 mb-4">
                  Your payment has been processed successfully. You will be redirected to your orders shortly.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => navigate('/orders')}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    View Orders
                  </button>
                  <button
                    onClick={() => navigate('/')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div>
            {paymentIntentId && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Payment Status
                </h2>
                <PaymentStatus
                  paymentIntentId={paymentIntentId}
                  autoRefresh={!showPaymentStatus}
                  refreshInterval={3000}
                />
              </div>
            )}

            {/* Security Notice */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
              <div className="flex">
                <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">
                    Secure Payment
                  </h3>
                  <p className="text-sm text-blue-600 mt-1">
                    Your payment information is encrypted and secure. We use Stripe to process payments safely.
                  </p>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-md p-4">
              <h3 className="text-sm font-medium text-gray-800 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600">
                If you encounter any issues with your payment, please contact our support team.
              </p>
              <button className="text-sm text-blue-600 hover:text-blue-800 mt-2">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
