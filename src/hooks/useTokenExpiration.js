import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkTokenExpiration } from '../redux/slices/authSlice';

export const useTokenExpiration = () => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only check if user is logged in
    if (!token || !user) return;

    // Check token expiration every 5 minutes
    const interval = setInterval(() => {
      dispatch(checkTokenExpiration());
    }, 5 * 60 * 1000); // 5 minutes

    // Also check immediately
    dispatch(checkTokenExpiration());

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [dispatch, token, user]);

  useEffect(() => {
    // Check token expiration when component mounts
    if (token && user) {
      dispatch(checkTokenExpiration());
    }
  }, [dispatch, token, user]);
};
