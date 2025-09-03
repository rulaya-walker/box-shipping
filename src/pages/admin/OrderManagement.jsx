import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaEye, FaEdit, FaDownload, FaTruck, FaCheckCircle, FaClock, FaTimes, FaTrash } from 'react-icons/fa';
import {
  fetchAdminOrders,
  updateOrderStatus,
  deleteOrder,
} from '../../redux/slices/adminOrderSlice';

const OrderManagement = () => {
  const dispatch = useDispatch();
  const {
    adminOrders,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.adminOrders);
  console.log('Admin Orders:', adminOrders);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const orderStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  const paymentStatuses = ['pending', 'paid', 'failed', 'refunded'];

  // Fetch orders on component mount and when filters change
  useEffect(() => {
    const filters = {
      page: 1,
      limit: 10,
      ...(statusFilter !== 'all' && { status: statusFilter }),
      ...(searchTerm && { search: searchTerm })
    };
    dispatch(fetchAdminOrders(filters));
  }, [dispatch, statusFilter, searchTerm]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id: orderId, status: newStatus })).unwrap();
      // Refresh orders after update
      const filters = {
        page: pagination?.currentPage || 1,
        limit: pagination?.limit || 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchTerm && { search: searchTerm })
      };
      dispatch(fetchAdminOrders(filters));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      try {
        await dispatch(deleteOrder(orderId)).unwrap();
        // Refresh orders after deletion
        const filters = {
          page: pagination?.currentPage || 1,
          limit: pagination?.limit || 10,
          ...(statusFilter !== 'all' && { status: statusFilter }),
          ...(searchTerm && { search: searchTerm })
        };
        dispatch(fetchAdminOrders(filters));
      } catch (error) {
        console.error('Failed to delete order:', error);
      }
    }
  };

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    // If there's a payment status update action in the slice, use it
    // For now, we'll just log it as the slice doesn't have this action
    console.log('Payment status update not implemented yet:', orderId, newPaymentStatus);
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      in_transit: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    const statusIcons = {
      pending: <FaClock className="w-3 h-3 mr-1" />,
      processing: <FaEdit className="w-3 h-3 mr-1" />,
      shipped: <FaTruck className="w-3 h-3 mr-1" />,
      in_transit: <FaTruck className="w-3 h-3 mr-1" />,
      delivered: <FaCheckCircle className="w-3 h-3 mr-1" />,
      cancelled: <FaTimes className="w-3 h-3 mr-1" />
    };

    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || statusStyles.pending}`}>
        {statusIcons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    const statusStyles = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || statusStyles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const calculateOrderStats = () => {
    const totalOrders = adminOrders.length;
    const totalRevenue = adminOrders
      .filter(order => order.paymentStatus === 'paid')
      .reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const pendingOrders = adminOrders.filter(order => order.status === 'pending').length;
    const deliveredOrders = adminOrders.filter(order => order.status === 'delivered').length;

    return { totalOrders, totalRevenue, pendingOrders, deliveredOrders };
  };

  const stats = calculateOrderStats();

  // For client-side display of the fetched orders
  const filteredOrders = adminOrders || [];

  return (
    <div>
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <FaTimes className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all customer orders and shipments.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FaEdit className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FaCheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FaClock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pendingOrders}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FaTruck className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.deliveredOrders}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Status Filter */}
        <div>
          <select
            value={paymentStatusFilter}
            onChange={(e) => setPaymentStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Payment Status</option>
            {paymentStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order._id || order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{order._id || order.id}</div>
                    {order.trackingNumber && (
                      <div className="text-xs text-gray-500">{order.trackingNumber}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.user?.name || order.customerName || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.user?.email || order.customerEmail || 'N/A'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {order.shippingAddress?.origin || order.origin || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      → {order.shippingAddress?.destination || order.destination || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${(order.totalPrice || order.totalAmount || 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {order.orderItems?.length || order.items?.length || 0} items
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={order.status}
                      onChange={(e) => {
                        handleUpdateStatus(order._id || order.id, e.target.value);
                        order.status = e.target.value;
                      }}
                      className="block w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm"
                    >
                      {["Processing", "Shipped", "Delivered", "Cancelled"].map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(order.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(order.createdAt || order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View Details"
                      >
                        <FaEye className="h-4 w-4" />
                      </button>
                      <button
                        className="text-green-600 hover:text-green-900"
                        title="Download Invoice"
                      >
                        <FaDownload className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Details - {selectedOrder._id || selectedOrder.id}
              </h3>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedOrder.customerName}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedOrder.customerEmail}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Shipping Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Origin:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedOrder.origin}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Destination:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedOrder.destination}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Method:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedOrder.shippingMethod}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Tracking:</span>
                      <span className="ml-2 text-sm text-gray-900">{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Status */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Order Status</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Order Status</label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => {
                        handleUpdateStatus(selectedOrder._id || selectedOrder.id, e.target.value);
                        setSelectedOrder({ ...selectedOrder, status: e.target.value });
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      {["processing", "shipped", "delivered", "cancelled"].map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Payment Status</label>
                    <select
                      value={selectedOrder.paymentStatus}
                      onChange={(e) => {
                        handleUpdatePaymentStatus(selectedOrder._id || selectedOrder.id, e.target.value);
                        setSelectedOrder({ ...selectedOrder, paymentStatus: e.target.value });
                      }}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      {paymentStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Order Dates */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Important Dates</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Order Date:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(selectedOrder.orderDate).toLocaleDateString()}
                    </span>
                  </div>
                  {selectedOrder.deliveryDate && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Delivery Date:</span>
                      <span className="ml-2 text-sm text-gray-900">
                        {new Date(selectedOrder.deliveryDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="bg-white border rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900 text-right">
                        Total Amount:
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">
                        ${selectedOrder.totalAmount.toFixed(2)} {selectedOrder.currency}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="mt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-3">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;