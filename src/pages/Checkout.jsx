import React from 'react';
import { useSelector } from 'react-redux';
import StripePayment from '../components/StripePayment';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutLoggedIn from './CheckoutLoggedIn';

const Checkout = () => {
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  // Redirect to login if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  if (user) {
    return <CheckoutLoggedIn />;
  }

  if (!cart || !cart.products || cart.products.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <p>Your cart is empty. Please add items before proceeding to checkout.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-6">Checkout</h2>
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Your Items</h3>
          <ul className="divide-y divide-gray-200">
            {cart.products.map((item, idx) => (
              <li key={idx} className="py-3 flex justify-between items-center">
                <span>{item.name || 'Item'} x {item.quantity}</span>
                <span>${item.price}</span>
              </li>
            ))}
          </ul>
        </div>
        <StripePayment />
      </div>
      <Footer />
    </>
  );
};

export default Checkout;
