import React from 'react';
import ActionButton from './ActionButton';

export interface Notification {
  id: string;
  text: string;
  type: 'approval' | 'info' | 'warning' | 'error' | string;
  timestamp?: string;
}

interface NotificationCardProps {
  notification: Notification;
  onView?: (id: string) => void;
  onMarkRead?: (id: string) => void;
  showActions?: boolean;
  className?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  notification,
  onView,
  onMarkRead,
  showActions = true,
  className = ''
}) => {
  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'approval':
        return {
          container: 'bg-green-50 border-green-500 text-green-800',
          icon: 'bg-green-100 text-green-600',
          badge: 'bg-green-100 text-green-800'
        };
      case 'info':
        return {
          container: 'bg-blue-50 border-blue-500 text-blue-800',
          icon: 'bg-blue-100 text-blue-600',
          badge: 'bg-blue-100 text-blue-800'
        };
      case 'warning':
        return {
          container: 'bg-yellow-50 border-yellow-500 text-yellow-800',
          icon: 'bg-yellow-100 text-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800'
        };
      case 'error':
        return {
          container: 'bg-red-50 border-red-500 text-red-800',
          icon: 'bg-red-100 text-red-600',
          badge: 'bg-red-100 text-red-800'
        };
      default:
        return {
          container: 'bg-gray-50 border-gray-500 text-gray-800',
          icon: 'bg-gray-100 text-gray-600',
          badge: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.19 4.82A10.018 10.018 0 0112 2c5.514 0 9.998 4.486 10 9.999 0 2.443-.892 4.688-2.37 6.415L15 17H5a2 2 0 01-2-2V6.828a2 2 0 01.586-1.414l.004-.004A9.993 9.993 0 0112 2z" />
          </svg>
        );
    }
  };

  const styles = getTypeStyles(notification.type);
  const timestamp = notification.timestamp || new Date().toLocaleDateString();

  return (
    <div
      className={`p-4 rounded-lg border-l-4 shadow-sm transition-all duration-200 hover:shadow-md ${styles.container} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            {/* Icon based on notification type */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${styles.icon}`}>
              {getTypeIcon(notification.type)}
            </div>
            
            {/* Notification content */}
            <div className="flex-1">
              <p className="text-sm font-medium leading-5">
                {notification.text}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${styles.badge}`}>
                  {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {timestamp}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        {showActions && (
          <div className="flex flex-col sm:flex-row sm:items-end items-center space-x-2 justify-end gap-2 ml-4">
            <ActionButton
              variant="primary"
              size="sm"
              onClick={() => onView?.(notification.id)}
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
              onClick={() => onMarkRead?.(notification.id)}
              className="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 text-white font-medium"
            >
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Mark Read
            </ActionButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCard;
