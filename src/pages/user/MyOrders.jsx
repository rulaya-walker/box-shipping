import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaEye, 
  FaDownload, 
  FaTruck, 
  FaCheckCircle, 
  FaClock, 
  FaTimes,
  FaFilter,
  FaCalendarAlt,
  FaBox
} from 'react-icons/fa';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const MyOrders = () => {
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      date: '2025-07-20',
      status: 'delivered',
      total: 156.99,
      currency: 'USD',
      items: [
        { name: 'Large Shipping Box', quantity: 2, price: 59.99 },
        { name: 'Medium Shipping Box', quantity: 1, price: 37.01 }
      ],
      trackingNumber: 'TRK-123456789',
      estimatedDelivery: '2025-07-22',
      actualDelivery: '2025-07-21',
      origin: 'New York, NY',
      destination: 'Los Angeles, CA'
    },
    {
      id: 'ORD-002',
      date: '2025-07-18',
      status: 'in_transit',
      total: 89.50,
      currency: 'USD',
      items: [
        { name: 'Standard Shipping Box', quantity: 3, price: 29.83 }
      ],
      trackingNumber: 'TRK-987654321',
      estimatedDelivery: '2025-07-23',
      actualDelivery: null,
      origin: 'Chicago, IL',
      destination: 'Miami, FL'
    },
    {
      id: 'ORD-003',
      date: '2025-07-15',
      status: 'processing',
      total: 234.75,
      currency: 'USD',
      items: [
        { name: 'Extra Large Shipping Box', quantity: 1, price: 89.99 },
        { name: 'Large Shipping Box', quantity: 2, price: 59.99 },
        { name: 'Packaging Materials', quantity: 1, price: 24.78 }
      ],
      trackingNumber: 'TRK-456789123',
      estimatedDelivery: '2025-07-25',
      actualDelivery: null,
      origin: 'Seattle, WA',
      destination: 'Denver, CO'
    },
    {
      id: 'ORD-004',
      date: '2025-07-10',
      status: 'cancelled',
      total: 67.25,
      currency: 'USD',
      items: [
        { name: 'Small Shipping Box', quantity: 5, price: 13.45 }
      ],
      trackingNumber: null,
      estimatedDelivery: null,
      actualDelivery: null,
      origin: 'Boston, MA',
      destination: 'Atlanta, GA'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'in_transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'last_7_days', label: 'Last 7 Days' },
    { value: 'last_30_days', label: 'Last 30 Days' },
    { value: 'last_90_days', label: 'Last 90 Days' }
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const orderDate = new Date(order.date);
      const now = new Date();
      const daysAgo = {
        'last_7_days': 7,
        'last_30_days': 30,
        'last_90_days': 90
      }[dateFilter];
      
      if (daysAgo) {
        const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
        matchesDate = orderDate >= cutoffDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

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
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getOrderStats = () => {
    const total = orders.length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const inProgress = orders.filter(o => ['processing', 'shipped', 'in_transit'].includes(o.status)).length;
    const totalSpent = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);

    return { total, delivered, inProgress, totalSpent };
  };

  const stats = getOrderStats();

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-gray-600">Track and manage your shipping orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FaBox className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FaCheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Delivered</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FaClock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FaTruck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <p className="text-2xl font-semibold text-gray-900">${stats.totalSpent.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-2">
                <FaFilter className="h-5 w-5 text-gray-400" />
                <span className="text-lg font-medium text-gray-900">Filter Orders</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Orders
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaSearch className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                    placeholder="Order ID or tracking number..."
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FaBox className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or create a new order.</p>
              <Link
                to="/new-quote"
                className="inline-flex items-center mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Create New Order
              </Link>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <FaCalendarAlt className="h-4 w-4" />
                            <span>Ordered on {new Date(order.date).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-500">Items:</span>
                          <span className="ml-1 text-gray-900">
                            {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-500">Total:</span>
                          <span className="ml-1 text-gray-900">${order.total.toFixed(2)}</span>
                        </div>
                        {order.trackingNumber && (
                          <div>
                            <span className="font-medium text-gray-500">Tracking:</span>
                            <span className="ml-1 text-gray-900 font-mono">{order.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-4 text-sm text-gray-600">
                        <span className="font-medium">Route:</span> {order.origin} → {order.destination}
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col sm:flex-row lg:flex-col space-y-2 sm:space-y-0 sm:space-x-2 lg:space-x-0 lg:space-y-2">
                      <Link
                        to={`/user/orders/${order.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        <FaEye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                      {order.status === 'delivered' && (
                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                          <FaDownload className="h-4 w-4 mr-2" />
                          Invoice
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};

export default MyOrders;
