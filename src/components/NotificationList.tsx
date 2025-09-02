import React from 'react';
import NotificationCard from './NotificationCard';
import type { Notification } from './NotificationCard';

interface NotificationListProps {
  notifications: Notification[];
  onView?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  showActions?: boolean;
  className?: string;
  emptyMessage?: string;
  emptyDescription?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onView,
  onMarkRead,
  showActions = true,
  className = '',
  emptyMessage = 'No notifications',
  emptyDescription = "You're all caught up!"
}) => {
  if (notifications.length === 0) {
    return (
      <div className={`text-center py-8 text-gray-500 ${className}`}>
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.82A10.018 10.018 0 0112 2c5.514 0 9.998 4.486 10 9.999 0 2.443-.892 4.688-2.37 6.415L15 17H5a2 2 0 01-2-2V6.828a2 2 0 01.586-1.414l.004-.004A9.993 9.993 0 0112 2z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">{emptyMessage}</h3>
        <p className="mt-1 text-sm text-gray-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onView={onView}
          onMarkRead={onMarkRead}
          showActions={showActions}
        />
      ))}
    </div>
  );
};

export default NotificationList;
