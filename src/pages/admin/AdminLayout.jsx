import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { 
  FaBoxes, 
  FaUsers, 
  FaShoppingCart, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaCog,
  FaUserCircle
} from 'react-icons/fa';
import { MdDashboard as FaDashboard } from "react-icons/md";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: FaDashboard },
    { name: 'Price Management', path: '/admin/prices', icon: FaCog },
    { name: 'Category Management', path: '/admin/categories', icon: FaBoxes },
    { name: 'Products', path: '/admin/products', icon: FaBoxes },
    { name: 'Users', path: '/admin/users', icon: FaUsers },
    { name: 'Orders', path: '/admin/orders', icon: FaShoppingCart },
    { name: 'Debug', path: '/admin/debug', icon: FaCog },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 flex z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
        </div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 flex flex-col w-64 bg-white shadow-lg transform z-50 transition-transform duration-300 ease-in-out
        md:translate-x-0 md:static md:inset-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-primary">
          <h1 className="text-white text-xl font-bold">Admin Panel</h1>
          <button
            className="md:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(false)}
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 flex-1">
          <div className="px-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`
                    group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200
                    ${isActive(item.path)
                      ? 'bg-primary-light text-primary-dark border-r-2 border-primary'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon 
                    className={`
                      mr-3 h-5 w-5 transition-colors duration-200
                      ${isActive(item.path) ? 'text-primary' : 'text-gray-500 group-hover:text-primary'}
                    `} 
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="flex-shrink-0">
              <FaUserCircle className="h-8 w-8 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@example.com'}
              </p>
              {user?.department && (
                <p className="text-xs text-gray-400 truncate">
                  {user.department}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              <FaCog className="h-4 w-4 mr-1" />
              Settings
            </button>
            <button 
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
            >
              <FaSignOutAlt className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow border-b border-gray-200">
          <button
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FaBars className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {navigationItems.find(item => isActive(item.path))?.name || 'Dashboard'}
              </h2>
            </div>
            
            <div className="ml-4 flex items-center md:ml-6">
              {/* Breadcrumb or additional nav items can go here */}
              <div className="text-sm text-gray-500">
                Welcome back, {user?.name || 'Admin'}
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
