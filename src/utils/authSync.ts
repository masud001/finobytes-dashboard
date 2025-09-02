import { store } from '../store';
import { forceLogout } from '../store/slices/authSlice';

// Cross-tab authentication synchronization
export const setupAuthSync = () => {
  const handleStorageChange = (e: StorageEvent) => {
    // Check if authentication data was removed
    if (e.key === 'auth-token' && e.newValue === null) {
      console.log('🔍 Auth token removed from localStorage, forcing logout');
      store.dispatch(forceLogout());
    }
    
    if (e.key === 'auth-role' && e.newValue === null) {
      console.log('🔍 Auth role removed from localStorage, forcing logout');
      store.dispatch(forceLogout());
    }
    
    if (e.key === 'auth-user' && e.newValue === null) {
      console.log('🔍 Auth user removed from localStorage, forcing logout');
      store.dispatch(forceLogout());
    }
    
    // Check if all auth data is missing
    const currentToken = localStorage.getItem('auth-token');
    const currentRole = localStorage.getItem('auth-role');
    const currentUser = localStorage.getItem('auth-user');
    
    if (!currentToken || !currentRole || !currentUser) {
      console.log('🔍 Authentication data missing from localStorage, forcing logout');
      store.dispatch(forceLogout());
    }
  };

  // Monitor localStorage changes
  window.addEventListener('storage', handleStorageChange);
  
  // Also monitor for manual localStorage clearing
  const originalClear = localStorage.clear;
  const originalRemoveItem = localStorage.removeItem;
  
  // Override localStorage.clear to detect when all data is cleared
  localStorage.clear = function() {
    console.log('🔍 localStorage.clear() called, forcing logout');
    store.dispatch(forceLogout());
    return originalClear.call(this);
  };
  
  // Override localStorage.removeItem to detect when auth items are removed
  localStorage.removeItem = function(key: string) {
    if (key.startsWith('auth-')) {
      console.log(`🔍 Auth item ${key} removed from localStorage, checking auth state`);
      // Check if all auth data is now missing
      setTimeout(() => {
        const currentToken = localStorage.getItem('auth-token');
        const currentRole = localStorage.getItem('auth-role');
        const currentUser = localStorage.getItem('auth-user');
        
        if (!currentToken || !currentRole || !currentUser) {
          console.log('🔍 All authentication data missing, forcing logout');
          store.dispatch(forceLogout());
        }
      }, 0);
    }
    return originalRemoveItem.call(this, key);
  };

  // Periodic check to ensure auth state stays in sync with localStorage
  const periodicCheck = setInterval(() => {
    const currentToken = localStorage.getItem('auth-token');
    const currentRole = localStorage.getItem('auth-role');
    const currentUser = localStorage.getItem('auth-user');
    const currentExpiry = localStorage.getItem('auth-expiry');
    
    const state = store.getState();
    
    // If Redux has auth data but localStorage doesn't, force logout
    if (state.auth.token && (!currentToken || !currentRole || !currentUser)) {
      console.log('🔍 Periodic check: Redux has auth data but localStorage is missing, forcing logout');
      store.dispatch(forceLogout());
    }
    
    // If localStorage has expired token, force logout
    if (currentExpiry) {
      const expiryTime = parseInt(currentExpiry);
      const now = Date.now();
      if (now >= expiryTime) {
        console.log('🔍 Periodic check: Token expired, forcing logout');
        store.dispatch(forceLogout());
      }
    }
  }, 5000); // Check every 5 seconds

  // Cleanup function
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    clearInterval(periodicCheck);
    // Restore original methods
    localStorage.clear = originalClear;
    localStorage.removeItem = originalRemoveItem;
  };
};

// Manual function to force logout and clear all data
export const forceLogoutAndClear = () => {
  console.log('🔍 Manual force logout called');
  store.dispatch(forceLogout());
  
  // Clear all localStorage data
  localStorage.removeItem('auth-token');
  localStorage.removeItem('auth-role');
  localStorage.removeItem('auth-user');
  localStorage.removeItem('auth-expiry');
  localStorage.removeItem('app-data');
  
  // Redirect to home page
  window.location.href = '/';
};
