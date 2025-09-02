import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/authSlice';
import type { RootState } from '../store';

export const useTokenExpiry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, tokenExpiry, isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isInitialized || !token || !tokenExpiry) return;

    const checkExpiry = () => {
      const now = Date.now();
      if (now >= tokenExpiry) {
        // Token expired, logout user
        dispatch(logout());
        navigate('/');
      }
    };

    // Check immediately
    checkExpiry();

    // Check every minute
    const interval = setInterval(checkExpiry, 60000);

    return () => clearInterval(interval);
  }, [dispatch, navigate, token, tokenExpiry, isInitialized]);
};
