import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';

const AuthNotifications = () => {
  const { user, loading, error } = useSelector((state) => state.auth);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (user && !loading) {
      setNotification({
        type: 'success',
        message: `Welcome back, ${user.name}!`,
        id: Date.now()
      });
    }
  }, [user, loading]);

  useEffect(() => {
    if (error) {
      setNotification({
        type: 'error',
        message: error,
        id: Date.now()
      });
    }
  }, [error]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className={`
        p-4 rounded-lg shadow-lg border-l-4 bg-white
        ${notification.type === 'success' 
          ? 'border-green-500 text-green-700' 
          : 'border-red-500 text-red-700'
        }
        animate-slideIn
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {notification.type === 'success' ? (
              <FaCheckCircle className="text-green-500" />
            ) : (
              <FaTimesCircle className="text-red-500" />
            )}
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthNotifications;
