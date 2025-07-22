import { useState, useCallback } from 'react';

// Custom hook for managing payment state and logic
export const usePayment = () => {
  const [paymentState, setPaymentState] = useState({
    isProcessing: false,
    isSuccess: false,
    error: null,
    paymentIntent: null,
    customer: null
  });

  const resetPaymentState = useCallback(() => {
    setPaymentState({
      isProcessing: false,
      isSuccess: false,
      error: null,
      paymentIntent: null,
      customer: null
    });
  }, []);

  const setProcessing = useCallback((processing) => {
    setPaymentState(prev => ({ ...prev, isProcessing: processing, error: null }));
  }, []);

  const setSuccess = useCallback((paymentData) => {
    setPaymentState(prev => ({
      ...prev,
      isProcessing: false,
      isSuccess: true,
      paymentIntent: paymentData.paymentIntent,
      customer: paymentData.customer,
      error: null
    }));
  }, []);

  const setError = useCallback((error) => {
    setPaymentState(prev => ({
      ...prev,
      isProcessing: false,
      error: error.message || 'An unexpected error occurred',
      isSuccess: false
    }));
  }, []);

  // Calculate order totals
  const calculateOrderTotal = useCallback((orderData) => {
    const {
      selectedService = 'express',
      quantities = {},
      destinationCharges = 1329.73,
      processingFee = 12.50
    } = orderData;

    // Service pricing
    const servicePricing = {
      standard: 15.99,
      express: 29.99,
      whiteglove: 59.99
    };

    const shippingCost = servicePricing[selectedService] || servicePricing.express;
    const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0) || 6;
    const itemsTotal = totalItems * 5.00; // Assuming $5 per item for demo

    const total = shippingCost + destinationCharges + processingFee + itemsTotal;

    return {
      itemsTotal: itemsTotal.toFixed(2),
      shippingCost: shippingCost.toFixed(2),
      destinationCharges: destinationCharges.toFixed(2),
      processingFee: processingFee.toFixed(2),
      total: total.toFixed(2),
      totalItems,
      serviceType: selectedService.charAt(0).toUpperCase() + selectedService.slice(1) + ' Shipping'
    };
  }, []);

  // Format currency for display
  const formatCurrency = useCallback((amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2
    }).format(amount);
  }, []);

  // Validate customer information
  const validateCustomerInfo = useCallback((customerInfo) => {
    const errors = {};

    if (!customerInfo.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!customerInfo.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!customerInfo.address?.line1?.trim()) {
      errors.address = 'Address is required';
    }

    if (!customerInfo.address?.city?.trim()) {
      errors.city = 'City is required';
    }

    if (!customerInfo.address?.postal_code?.trim()) {
      errors.postal_code = 'Postal code is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }, []);

  // Simulate backend payment processing
  const processPayment = useCallback(async (paymentData) => {
    setProcessing(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real application, you would:
      // 1. Send payment data to your backend
      // 2. Create a payment intent with Stripe
      // 3. Confirm the payment
      // 4. Handle webhooks for payment status updates
      // 5. Update your database with order information

      const mockResponse = {
        success: true,
        paymentIntent: {
          id: 'pi_' + Math.random().toString(36).substr(2, 9),
          amount: Math.round(parseFloat(paymentData.orderDetails.total) * 100),
          currency: 'usd',
          status: 'succeeded'
        },
        customer: {
          id: 'cus_' + Math.random().toString(36).substr(2, 9),
          email: paymentData.customerInfo.email,
          name: paymentData.customerInfo.name
        },
        order: {
          id: 'order_' + Math.random().toString(36).substr(2, 9),
          status: 'confirmed',
          tracking_number: 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase()
        }
      };

      setSuccess(mockResponse);
      return mockResponse;

    } catch (error) {
      setError(error);
      throw error;
    }
  }, [setProcessing, setSuccess, setError]);

  return {
    paymentState,
    resetPaymentState,
    setProcessing,
    setSuccess,
    setError,
    calculateOrderTotal,
    formatCurrency,
    validateCustomerInfo,
    processPayment
  };
};

// Stripe configuration
export const stripeConfig = {
  // Replace with your actual publishable key from Stripe Dashboard
  publishableKey: import.meta.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdef...',

  // Stripe options
  options: {
    locale: 'en',
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#374151',
        colorDanger: '#dc2626',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        spacingUnit: '4px',
        borderRadius: '8px'
      }
    }
  },

  // Card element options
  cardElementOptions: {
    style: {
      base: {
        fontSize: '16px',
        color: '#374151',
        '::placeholder': {
          color: '#9ca3af',
        },
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        padding: '12px',
      },
      invalid: {
        color: '#dc2626',
        iconColor: '#dc2626'
      },
      complete: {
        color: '#059669',
        iconColor: '#059669'
      }
    },
    hidePostalCode: false,
  }
};

// Payment utilities
export const paymentUtils = {
  // Format card errors
  formatCardError: (error) => {
    const errorMessages = {
      'card_declined': 'Your card was declined. Please try a different payment method.',
      'expired_card': 'Your card has expired. Please use a different card.',
      'incorrect_cvc': 'Your card security code is incorrect.',
      'processing_error': 'An error occurred while processing your payment. Please try again.',
      'rate_limit': 'Too many requests. Please wait a moment and try again.'
    };

    return errorMessages[error.code] || error.message || 'An unexpected error occurred.';
  },

  // Validate payment amount
  validateAmount: (amount) => {
    const numAmount = parseFloat(amount);
    return numAmount > 0 && numAmount < 999999.99;
  },

  // Generate order confirmation data
  generateConfirmation: (paymentResult, orderDetails, customerInfo) => {
    return {
      orderNumber: paymentResult.order?.id || 'ORD-' + Date.now(),
      trackingNumber: paymentResult.order?.tracking_number || 'TRK-' + Date.now(),
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      customerEmail: customerInfo.email,
      paymentAmount: orderDetails.total,
      paymentMethod: 'Card ending in ****',
      timestamp: new Date().toISOString()
    };
  }
};

export default usePayment;
