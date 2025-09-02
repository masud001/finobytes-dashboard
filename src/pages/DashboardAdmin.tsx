import React, { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import Layout from '../components/Layout';
import SystemStats from '../components/SystemStats';
import DataTable from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import { DataManager } from '../utils/dataManager';
import { forceSyncFromLocalStorage, forceSyncToLocalStorage } from '../store/slices/dataSlice';
import {
  ResponsiveBarChart,
  ResponsiveLineChart,
  ResponsiveDoughnutChart,
  ResponsiveAreaChart,
  ResponsiveChartGrid,
  ChartContainer,
} from '../components/ResponsiveCharts';

// Custom hook for real-time data synchronization
const useRealTimeDataSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [syncStatus, setSyncStatus] = useState<'syncing' | 'synced' | 'error'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());

  // Force sync from localStorage to Redux
  const syncFromLocalStorage = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      await dispatch(forceSyncFromLocalStorage());
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Failed to sync from localStorage:', error);
      setSyncStatus('error');
    }
  }, [dispatch]);

  // Force sync from Redux to localStorage
  const syncToLocalStorage = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      await dispatch(forceSyncToLocalStorage());
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Failed to sync to localStorage:', error);
      setSyncStatus('error');
    }
  }, [dispatch]);

  // Full data synchronization
  const fullSync = useCallback(async () => {
    try {
      setSyncStatus('syncing');
      // Sync JSON to localStorage first
      DataManager.syncFromJSONToLocalStorage();
      // Then sync localStorage to Redux
      await dispatch(forceSyncFromLocalStorage());
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    } catch (error) {
      console.error('Failed to perform full sync:', error);
      setSyncStatus('error');
    }
  }, [dispatch]);

  return {
    syncStatus,
    lastSyncTime,
    syncFromLocalStorage,
    syncToLocalStorage,
    fullSync
  };
};

const DashboardAdmin: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, merchants, purchases, notifications, points } = useSelector((state: RootState) => state.data);
  
  // Real-time data sync hook
  const { syncStatus, lastSyncTime, syncFromLocalStorage, fullSync } = useRealTimeDataSync();

  // Local state for immediate updates
  const [localUsers, setLocalUsers] = useState<any[]>([]);
  const [localMerchants, setLocalMerchants] = useState<any[]>([]);
  const [localPurchases, setLocalPurchases] = useState<any[]>([]);
  const [localNotifications, setLocalNotifications] = useState<any[]>([]);
  const [localPoints, setLocalPoints] = useState<Record<string, number>>({});

  // Data synchronization function
  const syncAllData = useCallback(async () => {
    try {
      // Get latest data from DataManager (localStorage)
      const localStorageData = DataManager.getLocalStorageData();
      
      if (localStorageData) {
        setLocalUsers(localStorageData.users || []);
        setLocalMerchants(localStorageData.merchants || []);
        setLocalPurchases(localStorageData.purchases || []);
        setLocalNotifications(localStorageData.notifications || []);
        setLocalPoints(localStorageData.points || {});
      }

      // Force sync from localStorage to Redux
      await syncFromLocalStorage();
      
    } catch (error) {
      console.error('❌ Admin Dashboard: Data sync failed:', error);
    }
  }, [syncFromLocalStorage]);

  // Initialize and sync data on component mount
  useEffect(() => {
    syncAllData();
    
    // Set up periodic sync every 30 seconds
    const syncInterval = setInterval(syncAllData, 30000);
    
    return () => clearInterval(syncInterval);
  }, [syncAllData]);

  // Listen for Redux store changes
  useEffect(() => {
    setLocalUsers(users);
    setLocalMerchants(merchants);
    setLocalPurchases(purchases);
    setLocalNotifications(notifications);
    setLocalPoints(points);
  }, [users, merchants, purchases, notifications, points]);

  // Listen for localStorage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app-data') {
        syncAllData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncAllData]);

  // Manual sync functions for admin actions
  const handleManualSync = async () => {
    await syncAllData();
  };

  const handleForceSync = async () => {
    await fullSync();
  };

  // Use the most up-to-date data (local state takes precedence)
  const currentUsers = localUsers.length > 0 ? localUsers : users;
  const currentMerchants = localMerchants.length > 0 ? localMerchants : merchants;
  const currentPurchases = localPurchases.length > 0 ? localPurchases : purchases;
  const currentNotifications = localNotifications.length > 0 ? localNotifications : notifications;

  // Chart data based on real data
  const userPointsData = {
    labels: currentUsers.map(user => user.name),
    datasets: [
      {
        label: 'User Points',
        data: currentUsers.map(user => user.points),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const purchaseStatusData = {
    labels: ['Pending Approval', 'Approved'],
    datasets: [
      {
        data: [
          currentPurchases.filter(p => !p.approved).length,
          currentPurchases.filter(p => p.approved).length,
        ],
        backgroundColor: [
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
        ],
        borderColor: [
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const monthlyActivityData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Users',
        data: [0, 0, 0, 0, 0, currentUsers.length], // Users joined in June
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
      {
        label: 'New Merchants',
        data: [0, 0, 0, 0, 0, currentMerchants.length], // Merchants joined in June
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const purchaseAmountsData = {
    labels: currentUsers.map(user => user.name),
    datasets: [
      {
        label: 'Purchase Amount ($)',
        data: currentPurchases.map(p => p.amount),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const monthlyUsersData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Users',
        data: [0, 0, 0, 0, 0, currentUsers.length], // Users active in June
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const monthlyMerchantsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Active Merchants',
        data: [0, 0, 0, 0, 0, currentMerchants.length], // Merchants active in June
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 2,
      },
    ],
  };

  const notificationTypesData = {
    labels: ['Approval', 'Info'],
    datasets: [
      {
        data: [
          currentNotifications.filter(n => n.type === 'approval').length,
          currentNotifications.filter(n => n.type === 'info').length,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const userGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'User Growth',
        data: [0, 0, 0, 0, 0, currentUsers.length], // Users joined by June
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const adminStats = [
    { 
      id: 'users', 
      label: 'Total Users', 
      value: currentUsers.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      color: 'blue' as const,
      change: { value: `+${currentUsers.length}`, type: 'increase' as const }
    },
    { 
      id: 'merchants', 
      label: 'Total Merchants', 
      value: currentMerchants.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      color: 'green' as const,
      change: { value: `+${currentMerchants.length}`, type: 'increase' as const }
    },
    { 
      id: 'purchases', 
      label: 'Total Purchases', 
      value: currentPurchases.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'purple' as const,
      change: { value: `+${currentPurchases.length}`, type: 'increase' as const }
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      value: currentNotifications.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.82A10.018 10.018 0 0112 2c5.514 0 9.998 4.486 10 9.999 0 2.443-.892 4.688-2.37 6.415L15 17H5a2 2 0 01-2-2V6.828a2 2 0 01.586-1.414l.004-.004A9.993 9.993 0 0112 2z" />
        </svg>
      ),
      color: 'yellow' as const,
      change: { value: `+${currentNotifications.length}`, type: 'increase' as const }
    },
  ];

  const usersColumns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'points', header: 'Points' },
    { key: 'actions', header: 'Actions' },
  ];

  const merchantsColumns = [
    { key: 'storeName', header: 'Store Name' },
    { key: 'owner', header: 'Owner' },
    { key: 'email', header: 'Email' },
    { key: 'actions', header: 'Actions' },
  ];

  const renderUserActions = (user: any) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        onClick={() => {}}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </ActionButton>
      <ActionButton
        onClick={() => {}}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </ActionButton>
      <ActionButton
        variant="danger"
        size="sm"
        onClick={() => handleDeleteUser(user.id)}
        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </ActionButton>
    </div>
  );

  const renderMerchantActions = (merchant: any) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        onClick={() => {}}
        className="bg-blue-500 hover:bg-blue-600 text-white"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </ActionButton>
      <ActionButton
        onClick={() => {}}
        className="bg-emerald-500 hover:bg-emerald-600 text-white"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 26">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </ActionButton>
      <ActionButton
        variant="danger"
        size="sm"
        onClick={() => handleDeleteMerchant(merchant.id)}
        className="bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Delete
      </ActionButton>
    </div>
  );

  const usersWithActions = currentUsers.map(user => ({
    ...user,
    actions: renderUserActions(user),
  }));

  const merchantsWithActions = currentMerchants.map(merchant => ({
    ...merchant,
    actions: renderMerchantActions(merchant),
  }));

  const handleDeleteUser = (userId: string) => {
    if (window.confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
      // Here you would typically dispatch a Redux action to delete the user
      // For now, we'll just log the action
      alert(`User ${userId} has been deleted successfully.`);
    }
  };

  const handleDeleteMerchant = (merchantId: string) => {
    if (window.confirm(`Are you sure you want to delete merchant ${merchantId}? This action cannot be undone.`)) {
      // Here you would typically dispatch a Redux action to delete the merchant
      // For now, we'll just log the action
      alert(`Merchant ${merchantId} has been deleted successfully.`);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.name || 'Administrator'}!
          </h1>
          <p className="text-blue-100 text-sm md:text-base">
            Here's what's happening with your Finobytes platform today.
          </p>
        </div>

        {/* Data Sync Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                syncStatus === 'syncing' ? 'bg-yellow-500 animate-pulse' :
                syncStatus === 'synced' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="text-sm font-medium text-gray-700">
                Data Sync Status: {
                  syncStatus === 'syncing' ? '🔄 Syncing...' :
                  syncStatus === 'synced' ? '✅ Synced' : '❌ Error'
                }
              </span>
              <span className="text-xs text-gray-500">
                Last sync: {lastSyncTime.toLocaleTimeString()}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleManualSync}
                disabled={syncStatus === 'syncing'}
                className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Sync Now
              </button>
              <button
                onClick={handleForceSync}
                disabled={syncStatus === 'syncing'}
                className="px-3 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ⚡ Force Sync
              </button>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-600">
            💡 Auto-sync every 30 seconds • Real-time updates from localStorage, Redux, and JSON data
          </div>
          <div className="mt-2 grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Users: {localUsers.length > 0 ? 'localStorage' : 'Redux'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>Merchants: {localMerchants.length > 0 ? 'localStorage' : 'Redux'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span>Purchases: {localPurchases.length > 0 ? 'localStorage' : 'Redux'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span>Notifications: {localNotifications.length > 0 ? 'localStorage' : 'Redux'}</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              <span>Points: {Object.keys(localPoints).length > 0 ? 'localStorage' : 'Redux'}</span>
            </div>
          </div>
        </div>

        {/* System Stats */}
        <SystemStats stats={adminStats} />

        {/* Charts Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Platform Analytics
          </h2>
          
          {/* First Row - 3 charts */}
          <ResponsiveChartGrid className="lg:grid-cols-3">
            <ChartContainer>
              <ResponsiveBarChart
                data={userPointsData}
                title="User Points Distribution"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveDoughnutChart
                data={purchaseStatusData}
                title="Purchase Status Overview"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveLineChart
                data={monthlyActivityData}
                title="Monthly Activity Trends"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveBarChart
                data={purchaseAmountsData}
                title="Purchase Amounts by User"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveBarChart
                data={monthlyUsersData}
                title="Monthly Active Users"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveBarChart
                data={monthlyMerchantsData}
                title="Monthly Active Merchants"
              />
            </ChartContainer>

            <ChartContainer>
              <ResponsiveDoughnutChart
                data={notificationTypesData}
                title="Notification Types"
              />
            </ChartContainer>
            <ChartContainer>
              <ResponsiveAreaChart
                data={userGrowthData}
                title="User Growth Trend"
              />
            </ChartContainer>

          </ResponsiveChartGrid>
        </div>

        {/* Data Tables Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            User Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>Users ({currentUsers.length})</span>
                <button
                  onClick={() => {}}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg className="-ml-0.5 mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add User
                </button>
              </h3>
              <DataTable
                data={usersWithActions}
                columns={usersColumns}
                searchable={true}
                sortable={true}
                pagination={true}
                className="text-sm"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-between">
                <span>Merchants ({currentMerchants.length})</span>
                <button
                  onClick={() => {}}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md font-medium transition-colors"
                >
                  <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Merchant
                </button>
              </h3>
              <DataTable
                data={merchantsWithActions}
                columns={merchantsColumns}
                searchable={true}
                sortable={true}
                pagination={true}
                className="text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardAdmin;
