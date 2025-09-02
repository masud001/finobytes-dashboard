import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import Layout from '../components/Layout';
import ActionButton from '../components/ActionButton';
import { LazySystemStats, LazyDataTable } from '../components/LazyComponents';
import {
  LazyResponsiveBarChart,
  LazyResponsiveLineChart,
  LazyResponsiveDoughnutChart,
  LazyResponsiveChartGrid,
  LazyChartContainer,
} from '../components/LazyCharts';

const DashboardMember: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { users, merchants, purchases } = useSelector((state: RootState) => state.data);

  // Get current user's data from Redux store
  const currentUser = users.find(u => u.id === user?.id);

  // Filter purchases for current user
  const userPurchases = purchases.filter(p => p.customerId === user?.id);

  // Enhanced purchase data with store names and better formatting
  const purchasesDataWithStoreNames = userPurchases.map(purchase => {
    const store = merchants.find(m => m.id === purchase.merchantId);
    return {
      id: purchase.id,
      store: store?.storeName || 'Unknown Store',
      amount: `$${purchase.amount}`,
      date: purchase.date,
      category: purchase.category,
      status: purchase.approved ? 'Approved' : 'Pending',
      points: `+${Math.round(purchase.amount / 10)}`, // 1 point per $10 spent
    };
  });

  // Chart data based on real data
  const monthlySpendingData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Monthly Spending ($)',
        data: [
          userPurchases.filter(p => p.date?.startsWith('2024-01')).reduce((sum, p) => sum + p.amount, 0),
          userPurchases.filter(p => p.date?.startsWith('2024-02')).reduce((sum, p) => sum + p.amount, 0),
          0, 0, 0, 0
        ],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const purchaseCategoriesData = {
    labels: ['Electronics', 'Clothing', 'Fashion', 'Food'],
    datasets: [
      {
        data: [
          userPurchases.filter(p => p.category === 'Electronics').reduce((sum, p) => sum + p.amount, 0),
          userPurchases.filter(p => p.category === 'Clothing').reduce((sum, p) => sum + p.amount, 0),
          userPurchases.filter(p => p.category === 'Fashion').reduce((sum, p) => sum + p.amount, 0),
          userPurchases.filter(p => p.category === 'Food').reduce((sum, p) => sum + p.amount, 0),
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const pointsEarnedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Points Earned',
        data: [
          userPurchases.filter(p => p.date?.startsWith('2024-01') && p.approved).reduce((sum, p) => sum + Math.round(p.amount / 10), 0),
          userPurchases.filter(p => p.date?.startsWith('2024-02') && p.approved).reduce((sum, p) => sum + Math.round(p.amount / 10), 0),
          0, 0, 0, 0
        ],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const merchantSpendingData = {
    labels: merchants.map(m => m.storeName),
    datasets: [
      {
        label: 'Spending at Each Store ($)',
        data: merchants.map(merchant => 
          userPurchases
            .filter(p => p.merchantId === merchant.id)
            .reduce((sum, p) => sum + p.amount, 0)
        ),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
      },
    ],
  };

  const memberStats = [
    { 
      id: 'points', 
      label: 'Total Points', 
      value: (currentUser?.points || 0).toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      ),
      color: 'purple' as const,
      change: { value: `+${currentUser?.points || 0}`, type: 'increase' as const }
    },
    { 
      id: 'spent', 
      label: 'Total Spent', 
      value: `$${userPurchases.reduce((sum, p) => sum + p.amount, 0)}`, 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      color: 'green' as const,
      change: { value: `+$${userPurchases.reduce((sum, p) => sum + p.amount, 0)}`, type: 'increase' as const }
    },
    { 
      id: 'purchases', 
      label: 'Total Purchases', 
      value: userPurchases.length.toString(), 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      color: 'blue' as const,
      change: { value: `+${userPurchases.length}`, type: 'increase' as const }
    },
    { 
      id: 'favorite', 
      label: 'Favorite Store', 
      value: 'ShopOne', 
      icon: (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      color: 'indigo' as const,
      change: { value: '1 visit', type: 'increase' as const }
    },
  ];

  const columns = [
    { key: 'store', header: 'Store' },
    { key: 'amount', header: 'Amount' },
    { key: 'date', header: 'Date' },
    { key: 'category', header: 'Category' },
    { key: 'status', header: 'Status' },
    { key: 'points', header: 'Points Earned' },
    { key: 'actions', header: 'Actions' },
  ];

  const renderPurchaseActions = (_purchase: any) => (
    <div className="flex flex-col sm:flex-row gap-2">
      <ActionButton
        variant="primary"
        size="sm"
        onClick={() => {}}
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
        onClick={() => {}}
        className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-medium"
      >
        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Receipt
      </ActionButton>
    </div>
  );

  const purchasesWithActions = purchasesDataWithStoreNames.map(purchase => ({
    ...purchase,
    actions: renderPurchaseActions(purchase),
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {currentUser?.name || 'Member'}! 👋
          </h1>
          <p className="text-purple-100">
            Here's your personalized dashboard with points, purchases, and insights.
          </p>
        </div>

        {/* System Stats */}
        <LazySystemStats stats={memberStats} />

        {/* Charts Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Personal Analytics
          </h2>
          
          {/* First Row - 2 charts */}
          <LazyResponsiveChartGrid className="lg:grid-cols-3">
            <LazyChartContainer>
              <LazyResponsiveBarChart
                data={monthlySpendingData}
                title="Monthly Spending Overview"
              />
            </LazyChartContainer>
            <LazyChartContainer>
              <LazyResponsiveDoughnutChart
                data={purchaseCategoriesData}
                title="Spending by Category"
              />
            </LazyChartContainer>
            <LazyChartContainer>
              <LazyResponsiveLineChart
                data={pointsEarnedData}
                title="Points Earned Over Time"
              />
            </LazyChartContainer>
            <LazyChartContainer>
              <LazyResponsiveBarChart
                data={merchantSpendingData}
                title="Spending by Merchant"
              />
            </LazyChartContainer>
          </LazyResponsiveChartGrid>

        </div>

        {/* Purchase History Section */}
        <div className="space-y-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
            Purchase History
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <LazyDataTable
              data={purchasesWithActions}
              columns={columns}
              searchable={true}
              sortable={true}
              pagination={true}
              className="text-sm"
            />
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              Redeem Points
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Use your points for discounts and rewards
            </p>
            <ActionButton
              variant="primary"
              onClick={() => {}}
              className="w-full bg-purple-600 hover:bg-purple-700 focus:ring-purple-500 text-white font-semibold text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Redeem Now
            </ActionButton>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Rewards
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Check available rewards and offers
            </p>
            <ActionButton
              variant="secondary"
              onClick={() => {}}
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500 text-white font-semibold text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Browse Rewards
            </ActionButton>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center justify-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Support
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Get help with your account or purchases
            </p>
            <ActionButton
              variant="secondary"
              onClick={() => {}}
              className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white font-semibold text-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Contact Support
            </ActionButton>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardMember;
