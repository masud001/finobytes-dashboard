// Component preloading utilities for better performance

// Preload dashboard components based on user role
export const preloadDashboardComponents = (role: string) => {
  switch (role) {
    case 'admin':
      import('../pages/DashboardAdmin');
      import('../components/LazyComponents');
      import('../components/LazyCharts');
      break;
    case 'merchant':
      import('../pages/DashboardMerchant');
      import('../components/LazyComponents');
      import('../components/LazyCharts');
      break;
    case 'member':
      import('../pages/DashboardMember');
      import('../components/LazyComponents');
      import('../components/LazyCharts');
      break;
    default:
      break;
  }
};

// Preload authentication components
export const preloadAuthComponents = () => {
  import('../pages/Auth');
  import('../components/FormInput');
  import('../components/FormButton');
};

// Preload chart components when user hovers over analytics sections
export const preloadChartComponents = () => {
  import('../components/ResponsiveCharts');
  import('../components/LazyCharts');
};

// Preload data table components
export const preloadDataTableComponents = () => {
  import('../components/DataTable');
  import('../components/SystemStats');
  import('../components/NotificationList');
};

// Preload all heavy components for better UX
export const preloadAllHeavyComponents = () => {
  preloadChartComponents();
  preloadDataTableComponents();
  import('../components/LazyComponents');
};

// Smart preloading based on user behavior
export const setupSmartPreloading = () => {
  // Preload on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadAllHeavyComponents();
    });
  } else {
    // Fallback for browsers without requestIdleCallback
    setTimeout(() => {
      preloadAllHeavyComponents();
    }, 2000);
  }

  // Preload on mouse movement (user is active)
  let mouseMoveTimeout: number;
  const handleMouseMove = () => {
    clearTimeout(mouseMoveTimeout);
    mouseMoveTimeout = setTimeout(() => {
      preloadAllHeavyComponents();
    }, 1000);
  };

  document.addEventListener('mousemove', handleMouseMove, { once: true });

  // Preload on scroll (user is engaging with content)
  let scrollTimeout: number;
  const handleScroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      preloadChartComponents();
    }, 500);
  };

  document.addEventListener('scroll', handleScroll, { once: true });
};

// Preload components for specific routes
export const preloadRouteComponents = (pathname: string) => {
  if (pathname.includes('/dashboard/')) {
    const role = pathname.split('/')[2];
    preloadDashboardComponents(role);
  } else if (pathname.includes('/login/') || pathname.includes('/register/')) {
    preloadAuthComponents();
  }
};
