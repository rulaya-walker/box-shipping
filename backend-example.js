// Backend API example for Stripe payment processing
// This would typically go in your Node.js/Express backend

const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/webhook', express.raw({ type: 'application/json' }));

// Create Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerInfo, orderDetails } = req.body;

    // Create or retrieve customer
    let customer;
    try {
      const customers = await stripe.customers.list({
        email: customerInfo.email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer = customers.data[0];
      } else {
        customer = await stripe.customers.create({
          email: customerInfo.email,
          name: customerInfo.name,
          phone: customerInfo.phone,
          address: {
            line1: customerInfo.address.line1,
            city: customerInfo.address.city,
            postal_code: customerInfo.address.postal_code,
            country: customerInfo.address.country || 'US'
          }
        });
      }
    } catch (error) {
      console.error('Customer creation error:', error);
      return res.status(400).json({ error: 'Failed to create customer' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customer.id,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderDetails.orderId || 'order_' + Date.now(),
        customerEmail: customerInfo.email,
        serviceType: orderDetails.serviceType,
        totalItems: orderDetails.totalItems.toString()
      },
      description: `Box Shipping Order - ${orderDetails.serviceType}`,
      receipt_email: customerInfo.email,
      shipping: {
        name: customerInfo.name,
        address: {
          line1: customerInfo.address.line1,
          city: customerInfo.address.city,
          postal_code: customerInfo.address.postal_code,
          country: customerInfo.address.country || 'US'
        }
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      customerId: customer.id,
      paymentIntentId: paymentIntent.id
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to create payment intent' 
    });
  }
});

// Confirm Payment
app.post('/api/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, paymentMethodId } = req.body;

    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
      payment_method: paymentMethodId,
      return_url: 'https://your-website.com/return'
    });

    res.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to confirm payment' 
    });
  }
});

// Retrieve Payment Intent
app.get('/api/payment-intent/:id', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.id);
    
    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      customer: paymentIntent.customer,
      metadata: paymentIntent.metadata
    });

  } catch (error) {
    console.error('Payment intent retrieval error:', error);
    res.status(404).json({ 
      error: 'Payment intent not found' 
    });
  }
});

// Webhook handler for Stripe events
app.post('/webhook/stripe', (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update your database with successful payment
      // Send confirmation email
      // Update order status
      handleSuccessfulPayment(paymentIntent);
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      
      // Handle failed payment
      // Send failure notification
      handleFailedPayment(failedPayment);
      break;

    case 'customer.created':
      const customer = event.data.object;
      console.log('Customer created:', customer.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

// Helper functions
async function handleSuccessfulPayment(paymentIntent) {
  try {
    // Update order status in database
    // await updateOrderStatus(paymentIntent.metadata.orderId, 'paid');
    
    // Send confirmation email
    // await sendConfirmationEmail(paymentIntent);
    
    // Create shipping label or notify fulfillment
    // await createShippingLabel(paymentIntent.metadata.orderId);
    
    console.log(`Order ${paymentIntent.metadata.orderId} payment successful`);
  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(paymentIntent) {
  try {
    // Update order status
    // await updateOrderStatus(paymentIntent.metadata.orderId, 'payment_failed');
    
    // Send failure notification
    // await sendPaymentFailureEmail(paymentIntent);
    
    console.log(`Order ${paymentIntent.metadata.orderId} payment failed`);
  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
}

// Refund endpoint
app.post('/api/refund', async (req, res) => {
  try {
    const { paymentIntentId, amount, reason = 'requested_by_customer' } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined, // Partial or full refund
      reason
    });

    res.json({
      success: true,
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        reason: refund.reason
      }
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(400).json({ 
      error: error.message || 'Failed to process refund' 
    });
  }
});

// Get customer payment methods
app.get('/api/customer/:customerId/payment-methods', async (req, res) => {
  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: req.params.customerId,
      type: 'card',
    });

    res.json({
      paymentMethods: paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: {
          brand: pm.card.brand,
          last4: pm.card.last4,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year
        }
      }))
    });

  } catch (error) {
    console.error('Payment methods retrieval error:', error);
    res.status(400).json({ 
      error: 'Failed to retrieve payment methods' 
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Stripe webhook endpoint: /webhook/stripe');
});

module.exports = app;
