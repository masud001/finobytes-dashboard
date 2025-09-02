import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const { role, user, isInitialized } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // Don't render header until authentication is initialized
  if (!isInitialized || !role) return null;

  // Get user display name based on role
  const getUserDisplayName = () => {
    if (!user) return '';
    
    switch (role) {
      case 'admin':
        return 'Administrator';
      case 'merchant':
        return user.owner || user.storeName || 'Merchant';
      case 'member':
        return user.name || 'Member';
      default:
        return 'User';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Finobytes
            </h1>
            <span className="ml-4 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              Welcome, {getUserDisplayName()}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
