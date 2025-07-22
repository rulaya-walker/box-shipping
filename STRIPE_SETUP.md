# Stripe Payment Integration Setup Guide

## Overview
This guide will help you set up a complete Stripe payment system for your box shipping application with all necessary configurations and security measures.

## 📋 Prerequisites

1. **Stripe Account**: Create a free account at [stripe.com](https://stripe.com)
2. **Node.js Backend**: For handling secure payment processing
3. **SSL Certificate**: Required for production payments
4. **Webhooks Endpoint**: For handling payment events

## 🔧 Setup Instructions

### 1. Stripe Account Configuration

#### Get Your API Keys
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com)
2. Navigate to **Developers > API Keys**
3. Copy your **Publishable Key** and **Secret Key**
4. For testing, use the keys that start with `pk_test_` and `sk_test_`

#### Configure Webhooks
1. Go to **Developers > Webhooks**
2. Click **Add endpoint**
3. Set endpoint URL: `https://yourdomain.com/webhook/stripe`
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `customer.created`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook Secret** for verification

### 2. Environment Variables

Create a `.env` file in your project root:

```bash
# Stripe Keys
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Application Config
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_COMPANY_NAME=Box Shipping Co.
REACT_APP_SUPPORT_EMAIL=support@boxshipping.com

# Database (if using)
DATABASE_URL=postgresql://username:password@localhost:5432/boxshipping
```

### 3. Frontend Integration

The React components are already set up with:

- **StripePayment.jsx**: Main payment component
- **usePayment.js**: Custom hook for payment logic
- **QuoteBody.jsx**: Integrated with payment flow

Key features included:
- ✅ Secure card input with Stripe Elements
- ✅ Customer information collection
- ✅ Order summary display
- ✅ Error handling and validation
- ✅ Payment success/failure states
- ✅ Mobile-responsive design

### 4. Backend Setup

#### Install Dependencies
```bash
npm install stripe express cors dotenv
```

#### Basic Server Structure
The `backend-example.js` file provides a complete backend implementation including:

- Payment intent creation
- Customer management
- Webhook handling
- Refund processing
- Payment method storage

#### Key Endpoints
- `POST /api/create-payment-intent` - Create payment
- `POST /api/confirm-payment` - Confirm payment
- `GET /api/payment-intent/:id` - Get payment status
- `POST /api/refund` - Process refunds
- `POST /webhook/stripe` - Handle Stripe events

### 5. Security Considerations

#### Frontend Security
- ✅ Never expose secret keys in frontend
- ✅ Use HTTPS in production
- ✅ Validate all inputs
- ✅ Implement rate limiting

#### Backend Security
- ✅ Verify webhook signatures
- ✅ Use environment variables for secrets
- ✅ Implement proper error handling
- ✅ Log security events

#### Data Protection
- ✅ PCI DSS compliance through Stripe
- ✅ No card data storage on your servers
- ✅ Encrypted data transmission
- ✅ Secure customer data handling

### 6. Testing

#### Test Cards
Stripe provides test cards for different scenarios:

```javascript
// Successful payments
4242424242424242  // Visa
4000056655665556  // Visa (debit)

// Declined payments
4000000000000002  // Generic decline
4000000000009995  // Insufficient funds

// Authentication required
4000002500003155  // 3D Secure authentication
```

#### Test Webhook Events
Use Stripe CLI to test webhooks locally:

```bash
# Install Stripe CLI
npm install -g stripe-cli

# Login to your account
stripe login

# Forward events to local server
stripe listen --forward-to localhost:3001/webhook/stripe
```

### 7. Production Deployment

#### Environment Setup
1. Replace test keys with live keys
2. Update webhook endpoint URL
3. Configure SSL certificate
4. Set up monitoring and logging

#### Compliance Checklist
- [ ] SSL/TLS enabled
- [ ] Webhook signature verification
- [ ] Error logging implemented
- [ ] Rate limiting configured
- [ ] Data retention policies set
- [ ] Privacy policy updated

### 8. Advanced Features

#### Subscription Billing
```javascript
// Create subscription
const subscription = await stripe.subscriptions.create({
  customer: customerId,
  items: [{ price: 'price_shipping_monthly' }],
  payment_behavior: 'default_incomplete',
  expand: ['latest_invoice.payment_intent'],
});
```

#### Multi-party Payments
```javascript
// Split payments between platform and sellers
const transfer = await stripe.transfers.create({
  amount: 2000,
  currency: 'usd',
  destination: 'acct_connected_account_id',
});
```

#### International Payments
```javascript
// Support multiple currencies
const paymentIntent = await stripe.paymentIntents.create({
  amount: 2000,
  currency: 'eur', // or 'gbp', 'cad', etc.
  payment_method_types: ['card', 'sepa_debit'],
});
```

### 9. Monitoring and Analytics

#### Stripe Dashboard
- Monitor payment volume
- Track success rates
- Analyze decline reasons
- Review dispute trends

#### Custom Analytics
- Integrate with Google Analytics
- Track conversion funnels
- Monitor user behavior
- A/B test payment flows

### 10. Customer Support

#### Payment Issues
- Provide payment receipt lookup
- Implement refund processing
- Handle dispute management
- Offer multiple payment methods

#### Integration Support
- Set up customer service webhooks
- Implement payment retry logic
- Provide payment status updates
- Handle failed payment recovery

## 🚀 Quick Start

1. **Install packages**:
   ```bash
   npm install @stripe/stripe-js @stripe/react-stripe-js
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Add your Stripe keys
   ```

3. **Start development**:
   ```bash
   npm start
   ```

4. **Test payment flow**:
   - Navigate to quote page
   - Add items and select service
   - Click "Proceed to Payment"
   - Use test card: 4242424242424242

## 📚 Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe React.js Guide](https://stripe.com/docs/stripe-js/react)
- [Payment Intent API](https://stripe.com/docs/api/payment_intents)
- [Webhooks Guide](https://stripe.com/docs/webhooks)
- [Testing Guide](https://stripe.com/docs/testing)

## 🆘 Troubleshooting

### Common Issues

1. **"Invalid API Key"**
   - Verify key starts with correct prefix (pk_test_ or pk_live_)
   - Check environment variable name
   - Ensure no extra spaces

2. **"Payment requires authentication"**
   - Handle 3D Secure in frontend
   - Use Stripe.js confirmCardPayment()

3. **Webhook signature verification failed**
   - Check webhook secret
   - Verify raw body parsing
   - Ensure correct endpoint URL

4. **CORS errors**
   - Configure backend CORS settings
   - Check domain whitelist
   - Verify request headers

For additional support, contact Stripe support or check their comprehensive documentation.
