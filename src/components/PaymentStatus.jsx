import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getPaymentStatus,
  selectStripeState,
  selectPaymentStep,
} from '../redux/slices/stripeSlice';

const PaymentStatus = ({ paymentIntentId, autoRefresh = false, refreshInterval = 5000 }) => {
  const dispatch = useDispatch();
  const {
    paymentStatus,
    checkout,
    isGettingStatus,
    paymentStatusError,
  } = useSelector(selectStripeState);
  
  const paymentStep = useSelector(selectPaymentStep);

  // Fetch payment status
  useEffect(() => {
    if (paymentIntentId) {
      dispatch(getPaymentStatus(paymentIntentId));
    }
  }, [paymentIntentId, dispatch]);

  // Auto-refresh payment status
  useEffect(() => {
    if (!autoRefresh || !paymentIntentId) return;

    const interval = setInterval(() => {
      if (paymentStatus !== 'succeeded' && paymentStatus !== 'canceled') {
        dispatch(getPaymentStatus(paymentIntentId));
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, paymentIntentId, paymentStatus, refreshInterval, dispatch]);

  const getStatusDisplay = () => {
    if (isGettingStatus) {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '🔄',
        title: 'Checking Status',
        message: 'Checking payment status...',
      };
    }

    switch (paymentStatus) {
      case 'succeeded':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          icon: '✅',
          title: 'Payment Successful',
          message: 'Your payment has been processed successfully.',
        };
      
      case 'processing':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          icon: '⏳',
          title: 'Processing Payment',
          message: 'Your payment is being processed.',
        };
      
      case 'requires_payment_method':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: '❌',
          title: 'Payment Failed',
          message: 'Your payment method was declined. Please try a different payment method.',
        };
      
      case 'requires_confirmation':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '⚠️',
          title: 'Confirmation Required',
          message: 'Your payment requires additional confirmation.',
        };
      
      case 'requires_action':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: '⚠️',
          title: 'Action Required',
          message: 'Additional action is required to complete your payment.',
        };
      
      case 'canceled':
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '🚫',
          title: 'Payment Cancelled',
          message: 'The payment has been cancelled.',
        };
      
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          icon: '❓',
          title: 'Unknown Status',
          message: 'Payment status is unknown.',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  if (paymentStatusError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <span className="text-xl mr-3">❌</span>
          <div>
            <h3 className="text-lg font-medium text-red-800">Error</h3>
            <p className="text-red-600">{paymentStatusError}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status Card */}
      <div className={`${statusDisplay.bgColor} border ${statusDisplay.borderColor} rounded-md p-4`}>
        <div className="flex items-start">
          <span className="text-2xl mr-3">{statusDisplay.icon}</span>
          <div className="flex-1">
            <h3 className={`text-lg font-medium ${statusDisplay.color}`}>
              {statusDisplay.title}
            </h3>
            <p className={`mt-1 ${statusDisplay.color}`}>
              {statusDisplay.message}
            </p>
            
            {autoRefresh && paymentStatus !== 'succeeded' && paymentStatus !== 'canceled' && (
              <p className="text-sm text-gray-500 mt-2">
                Status will refresh automatically every {refreshInterval / 1000} seconds
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {checkout && (
        <div className="bg-white border border-gray-200 rounded-md p-4">
          <h4 className="font-medium text-gray-900 mb-3">Payment Details</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-medium">${checkout.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Method:</span>
              <span className="font-medium">{checkout.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status:</span>
              <span className="font-medium">{checkout.paymentStatus}</span>
            </div>
            {checkout.paidAt && (
              <div className="flex justify-between">
                <span className="text-gray-600">Paid At:</span>
                <span className="font-medium">
                  {new Date(checkout.paidAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={() => dispatch(getPaymentStatus(paymentIntentId))}
          disabled={isGettingStatus}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGettingStatus ? 'Refreshing...' : 'Refresh Status'}
        </button>

        {paymentStatus === 'succeeded' && (
          <button
            onClick={() => window.location.href = '/orders'}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            View Orders
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentStatus;
