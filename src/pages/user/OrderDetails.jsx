import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in a real app, this would be fetched from an API
  const mockOrder = {
    id: 'ORD-001',
    date: '2025-07-20',
    status: 'delivered',
    total: 156.99,
    currency: 'USD',
    items: [
      { 
        id: 1,
        name: 'Large Shipping Box', 
        quantity: 2, 
        price: 59.99,
        description: '24" x 18" x 18" - Perfect for large items',
        image: null
      },
      { 
        id: 2,
        name: 'Medium Shipping Box', 
        quantity: 1, 
        price: 37.01,
        description: '18" x 14" x 12" - Great for medium-sized items',
        image: null
      }
    ],
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2025-07-22',
    actualDelivery: '2025-07-21',
    origin: {
      address: '123 Business St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    destination: {
      address: '456 Customer Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States'
    },
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    payment: {
      method: 'Credit Card',
      last4: '4242',
      brand: 'Visa',
      status: 'paid'
    },
    timeline: [
      {
        status: 'Order Placed',
        date: '2025-07-20 10:30 AM',
        description: 'Your order has been received and is being processed.',
        completed: true
      },
      {
        status: 'Payment Confirmed',
        date: '2025-07-20 10:45 AM',
        description: 'Payment has been successfully processed.',
        completed: true
      },
      {
        status: 'Package Prepared',
        date: '2025-07-20 2:15 PM',
        description: 'Your items have been packaged and ready for shipping.',
        completed: true
      },
      {
        status: 'Shipped',
        date: '2025-07-20 4:30 PM',
        description: 'Package has been picked up by the carrier.',
        completed: true
      },
      {
        status: 'In Transit',
        date: '2025-07-21 8:00 AM',
        description: 'Package is on its way to the destination.',
        completed: true
      },
      {
        status: 'Delivered',
        date: '2025-07-21 3:45 PM',
        description: 'Package has been successfully delivered.',
        completed: true
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setOrder(mockOrder);
      setLoading(false);
    }, 1000);
  }, [orderId]);

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

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-8">The order you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/user/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Order {order.id}</h1>
              <p className="mt-2 text-gray-600">
                Placed on {new Date(order.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              {getStatusBadge(order.status)}
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
                    {order.timeline.map((event, eventIdx) => (
                      <li key={eventIdx}>
                        <div className="relative pb-8">
                          {eventIdx !== order.timeline.length - 1 ? (
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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FaBox className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                        <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Quantity: {item.quantity}</span>
                          <span>Price: ${item.price.toFixed(2)} each</span>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Total</p>
                    <p>${order.total.toFixed(2)} {order.currency}</p>
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
                  <p className="text-sm font-mono text-gray-900">{order.trackingNumber}</p>
                </div>
                {order.estimatedDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Estimated Delivery</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {order.actualDelivery && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Delivered On</p>
                    <p className="text-sm text-gray-900">
                      {new Date(order.actualDelivery).toLocaleDateString()}
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
                    <p>{order.origin.address}</p>
                    <p>{order.origin.city}, {order.origin.state} {order.origin.zipCode}</p>
                    <p>{order.origin.country}</p>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaMapMarkerAlt className="h-4 w-4 text-gray-400" />
                    <p className="text-sm font-medium text-gray-900">To</p>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    <p>{order.destination.address}</p>
                    <p>{order.destination.city}, {order.destination.state} {order.destination.zipCode}</p>
                    <p>{order.destination.country}</p>
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
                      {order.payment.brand} ending in {order.payment.last4}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">{order.payment.status}</p>
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
                  <span className="text-sm text-gray-900">{order.customer.email}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FaPhone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{order.customer.phone}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {order.status === 'delivered' && (
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
  );
};

export default OrderDetails;
