import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { token, role, status, isInitialized, tokenExpiry } = useSelector((state: RootState) => state.auth);

  // If not yet initialized (still loading from localStorage), show loading state
  if (!isInitialized || status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to appropriate login
  if (!token || !role) {
    if (allowedRoles?.includes('admin')) {
      return <Navigate to="/login/admin" replace />;
    } else if (allowedRoles?.includes('merchant')) {
      return <Navigate to="/login/merchant" replace />;
    } else if (allowedRoles?.includes('member')) {
      return <Navigate to="/login/member" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // Check if token has expired
  if (tokenExpiry && Date.now() >= tokenExpiry) {
    // Token expired, redirect to login
    if (allowedRoles?.includes('admin')) {
      return <Navigate to="/login/admin" replace />;
    } else if (allowedRoles?.includes('merchant')) {
      return <Navigate to="/login/merchant" replace />;
    } else if (allowedRoles?.includes('member')) {
      return <Navigate to="/login/member" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // If role is not allowed, redirect to appropriate login
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'admin') {
      return <Navigate to="/login/admin" replace />;
    } else if (role === 'merchant') {
      return <Navigate to="/login/merchant" replace />;
    } else if (role === 'member') {
      return <Navigate to="/login/member" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
