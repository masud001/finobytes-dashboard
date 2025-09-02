// Route preloader utility for optimizing navigation performance

// Preload critical routes when user hovers over navigation
export const preloadRoute = (route: string) => {
  switch (route) {
    case 'admin':
      import('../pages/DashboardAdmin');
      break;
    case 'merchant':
      import('../pages/DashboardMerchant');
      break;
    case 'member':
      import('../pages/DashboardMember');
      break;
    default:
      break;
  }
};

// Preload dashboard components when user is authenticated
export const preloadDashboard = (role: string) => {
  switch (role) {
    case 'admin':
      import('../pages/DashboardAdmin');
      break;
    case 'merchant':
      import('../pages/DashboardMerchant');
      break;
    case 'member':
      import('../pages/DashboardMember');
      break;
    default:
      break;
  }
};

// Preload common components
export const preloadCommonComponents = () => {
  // Preload frequently used components
  import('../components/FormInput');
  import('../components/FormButton');
  import('../components/DataTable');
  import('../components/ActionButton');
};

// Preload charts when needed
export const preloadCharts = () => {
  import('../components/ResponsiveCharts');
};

// Preload data utilities
export const preloadDataUtils = () => {
  import('../utils/authService');
  import('../utils/validation');
};

// Initialize preloading strategy
export const initializePreloading = () => {
  // Preload common components after initial page load
  setTimeout(() => {
    preloadCommonComponents();
    preloadDataUtils();
  }, 2000);

  // Preload charts after a delay (they're not immediately needed)
  setTimeout(() => {
    preloadCharts();
  }, 5000);
};

// Preload on navigation intent (hover, focus)
export const setupNavigationPreloading = () => {
  // Preload admin dashboard on admin login hover
  const adminLoginLink = document.querySelector('a[href="/login/admin"]');
  if (adminLoginLink) {
    adminLoginLink.addEventListener('mouseenter', () => preloadRoute('admin'));
  }

  // Preload merchant dashboard on merchant login hover
  const merchantLoginLink = document.querySelector('a[href="/login/merchant"]');
  if (merchantLoginLink) {
    merchantLoginLink.addEventListener('mouseenter', () => preloadRoute('merchant'));
  }

  // Preload member dashboard on member login hover
  const memberLoginLink = document.querySelector('a[href="/login/member"]');
  if (memberLoginLink) {
    memberLoginLink.addEventListener('mouseenter', () => preloadRoute('member'));
  }
};
