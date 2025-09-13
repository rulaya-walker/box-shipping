import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderById } from '../../redux/slices/orderSlice';
import { 
  FaArrowLeft,
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimes,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDownload,
  FaPhone,
  FaEnvelope,
  FaBox,
  FaCreditCard
} from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { orderDetails, loading, error } = useSelector(state => state.orders);
  const { user } = useSelector(state => state.auth);
  
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId))
        .then((result) => {
          console.log('fetchOrderById result:', result);
        })
        .catch((error) => {
          console.error('fetchOrderById error:', error);
        });
      
      // Show celebration animation for new orders (check if redirected from payment)
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  }, [orderId, dispatch]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);


  // Log when Redux state changes
  useEffect(() => {
    console.log('OrderDetails Redux state changed:', { 
      orderDetails, 
      loading, 
      error,
      changeTimestamp: new Date().toISOString()
    });
  }, [orderDetails, loading, error]);

  console.log('OrderDetails component rendered with:', {
    orderDetails,
    loading,
    error,
    orderId
  });

  // For development: if no real order data and no error, show mock data
  if (!orderDetails && !loading && !error) {
    console.log('Using mock data - no real order found for ID:', orderId);
  }

  // Create mock data for development if no real order data
  const displayOrder = orderDetails || {
    _id: orderId,
    date: new Date().toISOString(),
    status: 'processing',
    totalPrice: 199.99,
    currency: 'USD',
    timeline: [
      {
        status: 'Order Placed',
        description: 'Your order has been confirmed',
        date: 'Today',
        completed: true
      },
      {
        status: 'Processing',
        description: 'We are preparing your shipment',
        date: 'In progress',
        completed: false
      }
    ],
    orderItems: [
      {
        id: 1,
        name: 'Sample Shipping Box',
        description: 'Mock shipping item for development',
        quantity: 1,
        price: 199.99
      }
    ],
    trackingNumber: 'DEV123456789',
    customer: {
      email: 'customer@example.com',
      phone: '+1 (555) 123-4567'
    },
    payment: {
      brand: 'Visa',
      last4: '4242',
      status: 'paid'
    },
    origin: {
      address: '123 Warehouse St',
      city: 'Shipping City',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    destination: {
      address: '456 Customer Ave',
      city: 'Customer City',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    }
  };


  // Handle loading and error states
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // For development: show mock data even if there's an error fetching real data
  console.log('Debug - Error state:', error, 'OrderDetails:', orderDetails);

  // Don't show error state in development - always show mock data
  // if (error && !orderDetails) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="text-center">
  //         <div className="text-red-500 text-6xl mb-4">⚠️</div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
  //         <p className="text-gray-600 mb-4">{error}</p>
  //         <Link
  //           to="/user/orders"
  //           className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
  //         >
  //           View All Orders
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }

  const getStatusBadge = (status) => {
    const statusStyles = {
      processing: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: FaClock },
      shipped: { bg: 'bg-blue-100', text: 'text-blue-800', icon: FaTruck },
      in_transit: { bg: 'bg-purple-100', text: 'text-purple-800', icon: FaTruck },
      delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: FaCheckCircle },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', icon: FaTimes }
    };

    const style = statusStyles[status] || statusStyles.processing;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-4 h-4 mr-2" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Don't show "order not found" in development since we have mock data
  // if (!order) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8">
  //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //         <div className="text-center">
  //           <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
  //           <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
  //           <Link
  //             to="/user/orders"
  //             className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
  //           >
  //             <FaArrowLeft className="h-4 w-4 mr-2" />
  //             Back to Orders
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'][Math.floor(Math.random() * 5)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success Banner for newly created orders */}
      {showConfetti && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-500 text-4xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">Payment Successful!</h2>
            <p className="text-green-700">
              Your order has been confirmed and payment processed successfully. 
              We'll begin preparing your shipment right away.
            </p>
          </div>
        </div>
      )}

      {/* Development Banner */}
      {!orderDetails && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-700">
              <strong>Development Mode:</strong> Showing mock order data since no real order was found for ID: {orderId}
              {error && <span className="block text-sm mt-1">API Error: {error}</span>}
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/user/orders"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <FaArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order {displayOrder._id}</h1>
              <p className="mt-2 text-gray-600">
                Placed on {displayOrder.date ? new Date(displayOrder.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : 'Unknown date'}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              {getStatusBadge(displayOrder.status || 'processing')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Timeline</h2>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {(displayOrder.timeline || []).map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== (displayOrder.timeline || []).length - 1 ? (
                            <span
                              className={`absolute top-4 left-4 -ml-px h-full w-0.5 ${
                                event.completed ? 'bg-green-500' : 'bg-gray-300'
                              }`}
                              aria-hidden="true"
                            />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span
                                className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                  event.completed
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                                }`}
                              >
                                <FaCheckCircle className="h-4 w-4 text-white" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                              <div>
                                <p className={`text-sm font-medium ${
                                  event.completed ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {event.status}
                                </p>
                                <p className={`text-sm ${
                                  event.completed ? 'text-gray-600' : 'text-gray-400'
                                }`}>
                                  {event.description}
                                </p>
                              </div>
                              <div className="text-right text-sm whitespace-nowrap text-gray-500">
                                <p>{event.date}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Items</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {(displayOrder.orderItems || []).map((item, index) => (
                    <div key={item.id || index} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-lg" />
                          ) : (
                            <FaBox className="h-8 w-8 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name || 'Unknown item'}</p>
                        <p className="text-sm text-gray-500">{item.description || 'No description'}</p>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Quantity: {item.quantity || 0}</span>
                          <span>Price: ${(item.price || 0).toFixed(2)} each</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${(displayOrder.totalPrice || 0).toFixed(2)} {displayOrder.currency || 'USD'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Tracking Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tracking Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tracking Number</p>
                  <p className="text-sm font-mono text-gray-900">{displayOrder.trackingNumber || 'Not available'}</p>
                </div>
                {displayOrder.estimatedDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                    <p className="text-sm text-gray-900">
                      {new Date(displayOrder.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {displayOrder.actualDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivered On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(displayOrder.actualDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping Addresses */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">From</p>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    <p>{displayOrder.origin || 'N/A'}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">To</p>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    <p>{displayOrder.destination || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Payment Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaCreditCard className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {displayOrder.paymentDetails?.paymentIntentId || 'Unknown'} ending in {displayOrder.paymentDetails?.cardLast4 || '****'} exp date {displayOrder.paymentDetails?.cardExpMonth || 'MM'}/{displayOrder.paymentDetails?.cardExpYear || 'YY'}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{displayOrder.paymentStatus || 'pending'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Customer Information</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{user?.email || 'Not provided'}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{displayOrder.paymentDetails?.phone || 'Not provided'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {displayOrder.status === 'delivered' && (
                <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                  <FaDownload className="h-4 w-4 mr-2" />
                  Download Invoice
                </button>
              )}
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                <FaPhone className="h-4 w-4 mr-2" />
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

const confettiStyles = `
  .confetti {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 9999;
  }

  .confetti-piece {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #FFD700;
    animation: confetti-fall 3s linear infinite;
  }

  .confetti-piece:nth-child(1) { background: #FF6B6B; left: 10%; animation-delay: 0s; }
  .confetti-piece:nth-child(2) { background: #4ECDC4; left: 20%; animation-delay: 0.5s; }
  .confetti-piece:nth-child(3) { background: #45B7D1; left: 30%; animation-delay: 1s; }
  .confetti-piece:nth-child(4) { background: #96CEB4; left: 40%; animation-delay: 1.5s; }
  .confetti-piece:nth-child(5) { background: #FFEAA7; left: 50%; animation-delay: 2s; }
  .confetti-piece:nth-child(6) { background: #DDA0DD; left: 60%; animation-delay: 0.8s; }
  .confetti-piece:nth-child(7) { background: #98D8C8; left: 70%; animation-delay: 1.3s; }
  .confetti-piece:nth-child(8) { background: #F7DC6F; left: 80%; animation-delay: 0.3s; }
  .confetti-piece:nth-child(9) { background: #BB8FCE; left: 90%; animation-delay: 1.8s; }
  .confetti-piece:nth-child(10) { background: #85C1E9; left: 15%; animation-delay: 0.7s; }

  @keyframes confetti-fall {
    0% {
      transform: translateY(-100vh) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: translateY(100vh) rotate(720deg);
      opacity: 0;
    }
  }

  .success-banner {
    animation: slideInFromTop 0.8s ease-out;
  }

  @keyframes slideInFromTop {
    0% {
      transform: translateY(-100%);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

// Add styles to head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = confettiStyles;
  document.head.appendChild(styleSheet);
}

export default OrderDetails;
