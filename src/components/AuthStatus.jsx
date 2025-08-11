import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isTokenExpired } from '../utils/tokenUtils';
import { logout } from '../redux/slices/authSlice';

const AuthStatus = () => {
  const { user, token } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [tokenExpired, setTokenExpired] = useState(false);
  
  useEffect(() => {
    const checkToken = () => {
      if (token && isTokenExpired(token)) {
        setTokenExpired(true);
        console.log('Token is expired, should logout');
        // Uncomment to auto-logout on token expiration
        // dispatch(logout());
      } else {
        setTokenExpired(false);
      }
    };
    
    checkToken();
    // Check every minute
    const interval = setInterval(checkToken, 60000);
    
    return () => clearInterval(interval);
  }, [token, dispatch]);
  
  if (!user || !token) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-yellow-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Not Authenticated</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">
          You need to log in to access this feature.
        </p>
      </div>
    );
  }
  
  if (tokenExpired) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-red-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium">Session Expired</span>
        </div>
        <p className="text-sm text-red-700 mt-1">
          Your session has expired. Please log in again.
        </p>
        <button
          onClick={() => dispatch(logout())}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
        >
          Log Out
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 text-green-800">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">Authenticated</span>
      </div>
      <p className="text-sm text-green-700 mt-1">
        Logged in as {user.name} ({user.email})
      </p>
    </div>
  );
};

export default AuthStatus;
