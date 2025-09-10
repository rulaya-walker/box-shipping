import React from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StripePayment from '../components/StripePayment';

const CheckoutLoggedIn = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Checkout (Logged In)</h2>
          <p>Your cart is empty. Please add items before proceeding to checkout.</p>
        </div>
        <Footer />
      </>
    );
  }

  const selectedCountryPrice = useSelector(state => state.prices.selectedCountryPrice);
  const cartTotal = cart.products.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  const showMinPrice = selectedCountryPrice && typeof selectedCountryPrice.price === 'number' && cartTotal < selectedCountryPrice.price;
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <StripePayment orderDetails={{
          cartItems: cart.products,
          cartTotal,
          totalAmount: showMinPrice ? selectedCountryPrice.price : cartTotal,
          name: user?.name,
          email: user?.email
        }} />
        <div className="mt-6 p-4 bg-green-50 rounded-lg text-green-700">
          Welcome, {user?.name || user?.email}! You are logged in and can complete your order.
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutLoggedIn;
