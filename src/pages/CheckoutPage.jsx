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

  {/* Checkout payment and status removed as requested */}
      </div>
    </div>
  );
};

export default CheckoutPage;
