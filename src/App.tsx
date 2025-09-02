import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { store } from './store';
import { setupAuthSync } from './utils/authSync';
import { hydrateFromStorage, logout } from './store/slices/authSlice';
import { loadData } from './store/slices/dataSlice';
import { initializePreloading, setupNavigationPreloading } from './utils/routePreloader';
import { initializeData } from './utils/dataManager';
import { DataManager } from './utils/dataManager';
import type { RootState } from './store';
import './App.css';

// Import JSON data for testing
import usersData from './data/users.json';
import merchantsData from './data/merchants.json';
import purchasesData from './data/purchases.json';

// Lazy load components for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const Auth = React.lazy(() => import('./pages/Auth'));
const DashboardAdmin = React.lazy(() => import('./pages/DashboardAdmin'));
const DashboardMerchant = React.lazy(() => import('./pages/DashboardMerchant'));
const DashboardMember = React.lazy(() => import('./pages/DashboardMember'));

// Loading component for Suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

// Protected Route component with lazy loading
const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) => {
  const { token, role, isInitialized } = useSelector((state: RootState) => state.auth);
  
  if (!isInitialized) {
    return <PageLoader />;
  }
  
  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// App Routes component that uses hooks
const AppRoutes = () => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    // Initialize data in localStorage
    initializeData();
    
    // Initialize authentication state from localStorage
    dispatch(hydrateFromStorage());

    // Load data from JSON files into Redux store
    dispatch(loadData());
    
    // Initialize cross-tab authentication sync
    const cleanupAuthSync = setupAuthSync();
    
    // Initialize route preloading strategy
    initializePreloading();
    
    // Setup navigation preloading
    setupNavigationPreloading();
    
    // Add utility functions to window for debugging
    (window as any).forceLogout = () => {
      dispatch(logout());
      // Force page reload to clear all state
      window.location.href = '/';
    };
    
    (window as any).checkAuthState = () => {
      // Function to check current auth state
    };
    
    // Add comprehensive data management utilities
    (window as any).dataManager = {
      // Check data consistency
      checkConsistency: () => {
        return DataManager.validateDataConsistency();
      },
      
      // Force sync from localStorage to Redux
      syncFromLocal: () => {
        DataManager.syncFromLocalStorageToRedux();
      },
      
      // Force sync from Redux to localStorage
      syncToLocal: () => {
        DataManager.syncFromReduxToLocalStorage();
      },
      
      // Sync JSON data to localStorage
      syncFromJSON: () => {
        DataManager.syncFromJSONToLocalStorage();
      },
      
      // Full data synchronization
      fullSync: () => {
        DataManager.fullDataSync();
      },
      
      // Initialize localStorage with JSON data
      initialize: () => {
        DataManager.initializeLocalStorage();
      },
      
      // Get all data from localStorage
      getLocalData: () => {
        return DataManager.getLocalStorageData();
      },
      
      // Get all data from Redux store
      getReduxData: () => {
        const state = store.getState();
        return {
          users: state.data.users,
          merchants: state.data.merchants,
          purchases: state.data.purchases,
          notifications: state.data.notifications,
          points: state.data.points,
          contributionRate: state.data.contributionRate
        };
      },
      
      // Get data statistics
      getStats: () => {
        return DataManager.getDataStats();
      },
      
      // Delete merchant by ID
      deleteMerchant: (id: string) => {
        DataManager.deleteMerchant(id);
      },
      
      // Delete user by ID
      deleteUser: (id: string) => {
        DataManager.deleteUser(id);
      },
      
      // Clear all data
      clearAll: () => {
        DataManager.clearAllData();
      },
      
      // Repair data inconsistencies
      repair: () => {
        DataManager.repairDataInconsistencies();
      },
      
      // Backup data
      backup: () => {
        const backup = DataManager.backupData();
        return backup;
      },
      
      // Restore from backup
      restore: () => {
        const restored = DataManager.restoreFromBackup();
        return restored;
      },
      
      // Comprehensive data sync test
      testDataSync: () => {
        
        // 1. Check JSON data
        
        // 2. Check localStorage data
        const localData = DataManager.getLocalStorageData();
        
        // 3. Check Redux store data
        const reduxData = store.getState().data;
        
        // 4. Check DataManager data
        const dmUsers = DataManager.getUsers();
        const dmMerchants = DataManager.getMerchants();
        const dmPurchases = DataManager.getPurchases();
        
        // 5. Check consistency
        const consistency = DataManager.validateDataConsistency();
        
        return {
          json: { users: usersData.length, merchants: merchantsData.length, purchases: purchasesData.length },
          localStorage: localData ? { users: localData.users?.length || 0, merchants: localData.merchants?.length || 0, purchases: localData.purchases?.length || 0 } : null,
          redux: { users: reduxData.users.length, merchants: reduxData.merchants.length, purchases: reduxData.purchases.length },
          dataManager: { users: dmUsers.length, merchants: dmMerchants.length, purchases: dmPurchases.length },
          consistency
        };
      },
      
      // Check app-data localStorage specifically
      checkAppData: () => {
        
        try {
          const appData = localStorage.getItem('app-data');
          if (appData) {
            const parsed = JSON.parse(appData);
            
            // Show last 5 merchants for demo credentials
            if (parsed.merchants && parsed.merchants.length > 0) {
            }
            
            return parsed;
          } else {
            return null;
          }
        } catch (error) {
          return null;
        }
      },
      
      // Force sync all data sources
      forceFullSync: () => {
        
        // 1. Sync JSON to localStorage
        DataManager.syncFromJSONToLocalStorage();
        
        // 2. Sync localStorage to Redux
        DataManager.syncFromLocalStorageToRedux();
        
        // 3. Verify sync
        const result = (window as any).dataManager.testDataSync();
        
        return result;
      }
    };
    
    // Cleanup function
    return cleanupAuthSync;
  }, [dispatch]);

  return (
    <Router>
      <div className="App">
        <React.Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Login Routes - All handled by unified Auth component */}
            <Route path="/login/admin" element={<Auth />} />
            <Route path="/login/merchant" element={<Auth />} />
            <Route path="/login/member" element={<Auth />} />
            
            {/* Registration Routes - All handled by unified Auth component */}
            <Route path="/register/admin" element={<Auth />} />
            <Route path="/register/merchant" element={<Auth />} />
            <Route path="/register/member" element={<Auth />} />
            
            {/* Dashboard Routes */}
            <Route 
              path="/dashboard/admin" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardAdmin />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/merchant" 
              element={
                <ProtectedRoute requiredRole="merchant">
                  <DashboardMerchant />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/member" 
              element={
                <ProtectedRoute requiredRole="member">
                  <DashboardMember />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}

export default App;
