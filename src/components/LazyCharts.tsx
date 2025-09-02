import React, { Suspense } from 'react';

// Lazy load individual chart components
const ResponsiveBarChart = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ResponsiveBarChart }))
);

const ResponsiveLineChart = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ResponsiveLineChart }))
);

const ResponsiveDoughnutChart = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ResponsiveDoughnutChart }))
);

const ResponsiveAreaChart = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ResponsiveAreaChart }))
);

const ResponsiveChartGrid = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ResponsiveChartGrid }))
);

const ChartContainer = React.lazy(() => 
  import('./ResponsiveCharts').then(module => ({ default: module.ChartContainer }))
);

// Loading component for charts
const ChartLoader = () => (
  <div className="w-full h-64 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center bg-gray-50 rounded-lg">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" aria-hidden="true"></div>
      <p className="mt-2 text-sm text-gray-600">Loading charts...</p>
      <span className="sr-only">Please wait while charts load</span>
    </div>
  </div>
);

// Lazy chart wrapper components with Suspense
export const LazyResponsiveBarChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ResponsiveBarChart {...props} />
  </Suspense>
);

export const LazyResponsiveLineChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ResponsiveLineChart {...props} />
  </Suspense>
);

export const LazyResponsiveDoughnutChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ResponsiveDoughnutChart {...props} />
  </Suspense>
);

export const LazyResponsiveAreaChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ResponsiveAreaChart {...props} />
  </Suspense>
);

export const LazyResponsiveChartGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ResponsiveChartGrid {...props} />
  </Suspense>
);

export const LazyChartContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = (props) => (
  <Suspense fallback={<ChartLoader />}>
    <ChartContainer {...props} />
  </Suspense>
);
