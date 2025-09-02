import React, { Suspense } from 'react';

// Lazy load heavy components
const DataTable = React.lazy(() => import('./DataTable'));
const SystemStats = React.lazy(() => import('./SystemStats'));
const NotificationList = React.lazy(() => import('./NotificationList'));

// Loading components for different component types
const TableLoader = () => (
  <div className="bg-white shadow rounded-lg p-6">
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </div>
);

const StatsLoader = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const NotificationLoader = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="p-4 rounded-lg border-l-4 border-gray-200 bg-gray-50">
        <div className="animate-pulse">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Lazy component wrappers with Suspense
export const LazyDataTable: React.FC<any> = (props) => (
  <Suspense fallback={<TableLoader />}>
    <DataTable {...props} />
  </Suspense>
);

export const LazySystemStats: React.FC<any> = (props) => (
  <Suspense fallback={<StatsLoader />}>
    <SystemStats {...props} />
  </Suspense>
);

export const LazyNotificationList: React.FC<any> = (props) => (
  <Suspense fallback={<NotificationLoader />}>
    <NotificationList {...props} />
  </Suspense>
);
