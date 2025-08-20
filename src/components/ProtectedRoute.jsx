import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/login' }) => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  // Check if user is authenticated
  if (!user) {
    // Preserve the current path WITH query parameters
    const fullPath = location.pathname + location.search;
    return <Navigate to={redirectTo} state={{ from: { pathname: fullPath } }} replace />;
  }

  // Check if specific role is required
  if (requiredRole && user.role !== requiredRole) {
    // If user is not admin but trying to access admin routes, redirect to user dashboard
    if (requiredRole === 'admin') {
      return <Navigate to="/user/account" replace />;
    }
    // For other role mismatches, redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
