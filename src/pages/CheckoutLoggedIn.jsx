import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StripePayment from '../components/StripePayment';
import { getPriceByCountry } from '../redux/slices/priceSlice';

const CheckoutLoggedIn = () => {
  const dispatch = useDispatch();
    // get toCountry from localstorage
    const toCountry = localStorage.getItem('toCountry');
    const selectedCountryPrice = useSelector((state) => state.prices.selectedCountryPrice);
    
    useEffect(() => {
      dispatch(getPriceByCountry(toCountry));
    }, [toCountry]);
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

  const cartTotal = cart.products.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0);
  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <StripePayment orderDetails={{
          cartItems: cart.products,
          cartTotal: selectedCountryPrice?.price ? selectedCountryPrice?.price : cart.totalPrice,
          totalAmount: cart.totalPrice < selectedCountryPrice?.price ? selectedCountryPrice?.price : cart.totalPrice,
          name: user?.name,
          email: user?.email
        }} />

      </div>
      <Footer />
    </>
  );
};

export default CheckoutLoggedIn;
