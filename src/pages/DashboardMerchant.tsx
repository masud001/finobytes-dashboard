import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Layout from '../components/Layout';
import ActionButton from '../components/ActionButton';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import { getUsers } from '../utils/dataManager';
import { LazySystemStats, LazyDataTable, LazyNotificationList } from '../components/LazyComponents';
import {
  LazyResponsiveBarChart,
  LazyResponsiveLineChart,
  LazyResponsiveDoughnutChart,
  LazyResponsiveChartGrid,
  LazyChartContainer,
} from '../components/LazyCharts';

const DashboardMerchant: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [customerPhone, setCustomerPhone] = React.useState('');
  const [customerId, setCustomerId] = React.useState('');
  const [contributionRate, setContributionRate] = React.useState('');
  const [isApproving, setIsApproving] = React.useState<string | null>(null);
  const [lookupResult, setLookupResult] = React.useState<any>(null);
  const [isLookingUp, setIsLookingUp] = React.useState(false);

  // Load data from localStorage on component mount
  React.useEffect(() => {
    const savedPurchases = localStorage.getItem('purchases');
    const savedNotifications = localStorage.getItem('notifications');
    const savedContributionRate = localStorage.getItem('contributionRate');
    
    if (savedPurchases) {
      try {
        const parsedPurchases = JSON.parse(savedPurchases);
        setPurchasesData(parsedPurchases);
      } catch (error) {
        console.error('Error parsing saved purchases:', error);
      }
    }
    
    if (savedNotifications) {
      try {
        const parsedNotifications = JSON.parse(savedNotifications);
        setNotificationsData(parsedNotifications);
      } catch (error) {
        console.error('Error parsing saved notifications:', error);
        // Fallback to default notifications if parsing fails
        setNotificationsData([
          { id: 'n1', text: 'Purchase p1 awaiting approval', type: 'approval' },
          { id: 'n2', text: 'Merchant m2 submitted store details', type: 'info' },
          { id: 'n3', text: 'System maintenance scheduled for tonight', type: 'warning' },
          { id: 'n4', text: 'New customer registration completed', type: 'info' },
          { id: 'n5', text: 'Daily sales report generated successfully', type: 'approval' },
        ]);
      }
    }

    if (savedContributionRate) {
      setContributionRate(savedContributionRate);
    }
  }, []);

  // Load users data from localStorage
  const [usersData, setUsersData] = useState<any[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const loadData = () => {
      const users = getUsers();
      setUsersData(users);
    };

    loadData();
    
    // Listen for storage changes to update data in real-time
    const handleStorageChange = () => {
      loadData();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const [purchasesData, setPurchasesData] = React.useState([
    { id: 'p1', customerId: 'u1', amount: 150, approved: false },
    { id: 'p2', customerId: 'u2', amount: 39, approved: false },
  ]);

  const [notificationsData, setNotificationsData] = React.useState([
    { id: 'n1', text: 'Purchase p1 awaiting approval', type: 'approval' },
    { id: 'n2', text: 'Merchant m2 submitted store details', type: 'info' },
    { id: 'n3', text: 'System maintenance scheduled for tonight', type: 'warning' },
    { id: 'n4', text: 'New customer registration completed', type: 'info' },
    { id: 'n5', text: 'Daily sales report generated successfully', type: 'approval' },
  ]);

  // Chart data based on real data
  const purchaseAmountsData = {
    labels: usersData.map(user => user.name),
    datasets: [
      {
        label: 'Purchase Amount ($)',
        data: purchasesData.map(p => p.amount),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
      },
    ],
  };

  const purchaseStatusData = {
    labels: ['Pending Approval', 'Approved'],
    datasets: [
      {
        data: [
          purchasesData.filter(p => !p.approved).length,
          purchasesData.filter(p => p.approved).length,
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

  const monthlyTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Sales ($)',
        data: [0, 0, 0, 0, 0, purchasesData.reduce((sum, p) => sum + p.amount, 0)], // Total sales in June
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const customerPointsData = {
    labels: usersData.map(user => user.name),
    datasets: [
      {
        label: 'Customer Points',
        data: usersData.map(user => user.points),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const merchantStats = [
    { 
      id: 'sales', 
      label: 'Total Sales', 
      value: `$${purchasesData.reduce((sum, p) => sum + p.amount, 0)}`, 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'green' as const,
      change: { value: `+$${purchasesData.reduce((sum, p) => sum + p.amount, 0)}`, type: 'increase' as const }
    },
    { 
      id: 'customers', 
      label: 'Total Customers', 
      value: usersData.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'blue' as const,
      change: { value: `+${usersData.length}`, type: 'increase' as const }
    },
    { 
      id: 'purchases', 
      label: 'Total Purchases', 
      value: purchasesData.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'purple' as const,
      change: { value: `+${purchasesData.length}`, type: 'increase' as const }
    },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      value: notificationsData.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.82A10.018 10.018 0 0112 2c5.514 0 9.998 4.486 10 9.999 0 2.443-.892 4.688-2.37 6.415L15 17H5a2 2 0 01-2-2V6.828a2 2 0 01.586-1.414l.004-.004A9.993 9.993 0 0112 2z" />
        </svg>
      ),
      color: 'yellow' as const,
      change: { value: `+${notificationsData.length}`, type: 'increase' as const }
    },
  ];

  const purchasesColumns = [
    { key: 'customerName', header: 'Customer' },
    { key: 'amount', header: 'Amount' },
    { key: 'date', header: 'Date' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  const customersColumns = [
    { key: 'name', header: 'Name' },
    { key: 'phone', header: 'Phone' },
    { key: 'totalSpent', header: 'Total Spent' },
    { key: 'points', header: 'Points' },
    { key: 'actions', header: 'Actions' },
  ];



  const purchasesDataWithCustomerNames = purchasesData.map(purchase => {
    const customer = usersData.find(u => u.id === purchase.customerId);
    return {
      ...purchase,
      customerName: customer?.name || 'Unknown',
      date: '2024-01-15', // Using a default date since it's not in the data
      status: purchase.approved ? 'Approved' : 'Pending',
    };
  });

  const customersData = usersData.map(user => {
    const userPurchases = purchasesData.filter(p => p.customerId === user.id);
    const totalSpent = userPurchases.reduce((sum, p) => sum + p.amount, 0);
    return {
      id: user.id,
      name: user.name,
      phone: user.phone,
      totalSpent: `$${totalSpent}`,
      points: user.points,
    };
  });

  const renderPurchaseActions = (purchase: any) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        variant="primary"
        size="sm"
        onClick={() => console.log('View purchase:', purchase.id)}
        className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </ActionButton>
      {!purchase.approved && (
        <ActionButton
          variant="success"
          size="sm"
          onClick={() => handleApprovePurchase(purchase.id)}
          loading={isApproving === purchase.id}
          className="bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white font-medium"
        >
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Approve
        </ActionButton>
      )}
      <ActionButton
        variant="secondary"
        size="sm"
        onClick={() => console.log('Update status:', purchase.id)}
        className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Update
      </ActionButton>
    </div>
  );

  const renderCustomerActions = (customer: any) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        variant="primary"
        size="sm"
        onClick={() => console.log('View customer:', customer.id)}
        className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        View
      </ActionButton>
      <ActionButton
        variant="secondary"
        size="sm"
        onClick={() => console.log('Edit customer:', customer.id)}
        className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        Edit
      </ActionButton>
    </div>
  );



  const purchasesWithActions = purchasesDataWithCustomerNames.map(purchase => ({
    ...purchase,
    actions: renderPurchaseActions(purchase),
  }));

  const customersWithActions = customersData.map(customer => ({
    ...customer,
    actions: renderCustomerActions(customer),
  }));



  const handleCustomerLookup = () => {
    if (!customerPhone.trim() && !customerId.trim()) {
      alert('Please enter either a phone number or customer ID');
      return;
    }

    setIsLookingUp(true);
    
    // Simulate async lookup process
    setTimeout(() => {
      let foundCustomer = null;
      
      if (customerId.trim()) {
        // Lookup by ID
        foundCustomer = usersData.find(user => user.id === customerId.trim());
      } else if (customerPhone.trim()) {
        // Lookup by phone
        foundCustomer = usersData.find(user => user.phone === customerPhone.trim());
      }
      
      if (foundCustomer) {
        setLookupResult(foundCustomer);
        console.log('Customer found:', foundCustomer);
      } else {
        setLookupResult(null);
        alert('Customer not found. Please check your input and try again.');
      }
      
      setIsLookingUp(false);
    }, 1000);
  };

  const handleContributionUpdate = () => {
    if (!contributionRate.trim()) {
      alert('Please enter a contribution rate');
      return;
    }
    
    console.log('Updating contribution rate:', contributionRate);
    // Persist to localStorage
    localStorage.setItem('contributionRate', contributionRate);
    
    // Show success message
    alert(`Contribution rate updated to ${contributionRate}%`);
  };

  const handleApprovePurchase = async (purchaseId: string) => {
    setIsApproving(purchaseId);
    
    // Simulate async approval process
    setTimeout(() => {
      console.log('Purchase approved:', purchaseId);
      
      // Update purchase status in state
      const updatedPurchases = purchasesData.map(p => 
        p.id === purchaseId ? { ...p, approved: true } : p
      );
      setPurchasesData(updatedPurchases);
      
      // Persist to localStorage
      localStorage.setItem('purchases', JSON.stringify(updatedPurchases));
      
      // Add notification to state
      const newNotification = {
        id: `n${Date.now()}`,
        text: `Purchase ${purchaseId} has been approved`,
        type: 'approval'
      };
      
      const updatedNotifications = [...notificationsData, newNotification];
      setNotificationsData(updatedNotifications);
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
      
      setIsApproving(null);
      
      // No need to refresh page - state updates will re-render
    }, 1000);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {user?.owner || 'Merchant'}!
          </h1>
          <p className="text-green-100 text-sm md:text-base">
            Manage your store and track your business performance.
          </p>
        </div>

        {/* System Stats */}
        <LazySystemStats stats={merchantStats} />

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Lookup */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Lookup</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  id="customerPhone"
                  name="customerPhone"
                  label="Customer Phone"
                  type="text"
                  placeholder="Enter customer phone number"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full"
                />
                <FormInput
                  id="customerId"
                  name="customerId"
                  label="Customer ID"
                  type="text"
                  placeholder="Enter customer ID (e.g., u1, u2)"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full"
                />
              </div>
              <FormButton
                type="button"
                onClick={handleCustomerLookup}
                disabled={!customerPhone.trim() && !customerId.trim()}
                className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500 text-white font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                variant="primary"
              >
                {isLookingUp ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
                {isLookingUp ? 'Looking up...' : 'Lookup Customer'}
              </FormButton>
              
              {/* Customer Information Display */}
              {lookupResult && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-sm font-semibold text-blue-900 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium text-blue-800">ID:</span>
                      <span className="ml-2 text-blue-700">{lookupResult.id}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Name:</span>
                      <span className="ml-2 text-blue-700">{lookupResult.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Email:</span>
                      <span className="ml-2 text-blue-700">{lookupResult.email}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Phone:</span>
                      <span className="ml-2 text-blue-700">{lookupResult.phone}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Points:</span>
                      <span className="ml-2 text-blue-700">{lookupResult.points}</span>
                    </div>
                    <div>
                      <span className="font-medium text-blue-800">Total Spent:</span>
                      <span className="ml-2 text-blue-700">
                        ${purchasesData
                          .filter(p => p.customerId === lookupResult.id)
                          .reduce((sum, p) => sum + p.amount, 0)
                        }
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <button
                      onClick={() => {
                        setLookupResult(null);
                        setCustomerPhone('');
                        setCustomerId('');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Clear Result
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contribution Rate Setting */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contribution Rate Setting</h2>
            <div className="space-y-4">
              <FormInput
                id="contributionRate"
                name="contributionRate"
                label="Contribution Rate"
                type="text"
                placeholder="Enter contribution rate (%)"
                value={contributionRate}
                onChange={(e) => setContributionRate(e.target.value)}
                className="w-full"
              />
              <FormButton
                type="button"
                onClick={handleContributionUpdate}
                className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-semibold text-sm"
                variant="secondary"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Update Rate
              </FormButton>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Store Analytics
          </h2>
          
          {/* First Row - 3 charts */}
          <LazyResponsiveChartGrid className="lg:grid-cols-3">
            <LazyChartContainer>
              <LazyResponsiveBarChart
                data={purchaseAmountsData}
                title="Purchase Amounts by Customer"
              />
            </LazyChartContainer>
            <LazyChartContainer>
              <LazyResponsiveDoughnutChart
                data={purchaseStatusData}
                title="Purchase Status Distribution"
              />
            </LazyChartContainer>
            <LazyChartContainer>
              <LazyResponsiveLineChart
                data={monthlyTrendsData}
                title="Monthly Purchase Trends"
              />
            </LazyChartContainer>
          </LazyResponsiveChartGrid>

          {/* Second Row - 1 chart */}
          <LazyResponsiveChartGrid className="lg:grid-cols-1">
            <LazyChartContainer>
              <LazyResponsiveBarChart
                data={customerPointsData}
                title="Customer Points Overview"
              />
            </LazyChartContainer>
          </LazyResponsiveChartGrid>
        </div>

        {/* Data Tables Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Store Management
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchases</h3>
              <LazyDataTable
                data={purchasesWithActions}
                columns={purchasesColumns}
                searchable={true}
                sortable={true}
                pagination={true}
                className="text-sm"
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Database</h3>
              <LazyDataTable
                data={customersWithActions}
                columns={customersColumns}
                searchable={true}
                sortable={true}
                pagination={true}
                className="text-sm"
              />
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h3>
                        <LazyNotificationList
              notifications={notificationsData}
              onView={(id: string) => console.log('View notification:', id)}
              onMarkRead={(id: string) => console.log('Mark as read:', id)}
              showActions={true}
              emptyMessage="No notifications"
              emptyDescription="You're all caught up!"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardMerchant;
