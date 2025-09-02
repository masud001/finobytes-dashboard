import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import HeroSection from '../components/HeroSection';
import SectionHeader from '../components/SectionHeader';
import FeatureCard from '../components/FeatureCard';
import { Icons } from '../components/Icons';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { token, role, isInitialized } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isInitialized && token && role) {
      if (role === 'admin') {
        navigate('/dashboard/admin');
      } else if (role === 'merchant') {
        navigate('/dashboard/merchant');
      } else if (role === 'member') {
        navigate('/dashboard/member');
      }
    }
  }, [isInitialized, token, role, navigate]);

  // Show loading while checking authentication
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If already authenticated, don't render the home page
  if (token && role) {
    return null;
  }

  // Features data
  const features = [
    {
      icon: Icons.security,
      title: 'Secure Authentication',
      description: 'Role-based access control with secure login',
      colorScheme: 'blue' as const
    },
    {
      icon: Icons.purchase,
      title: 'Purchase Management',
      description: 'Approve and track customer purchases',
      colorScheme: 'green' as const
    },
    {
      icon: Icons.points,
      title: 'Points System',
      description: 'Track customer loyalty points',
      colorScheme: 'purple' as const
    },
    {
      icon: Icons.realtime,
      title: 'Real-time Updates',
      description: 'Live notifications and status updates',
      colorScheme: 'yellow' as const
    }
  ];

  // Role cards for quick access
  const roleCards = [
    {
      title: 'Admin Access',
      description: 'Manage users and merchants',
      icon: Icons.admin,
      colorScheme: 'blue' as const,
      route: '/login/admin'
    },
    {
      title: 'Merchant Access',
      description: 'Approve purchases and manage store',
      icon: Icons.merchant,
      colorScheme: 'green' as const,
      route: '/login/merchant'
    },
    {
      title: 'Member Access',
      description: 'View points and purchase history',
      icon: Icons.member,
      colorScheme: 'purple' as const,
      route: '/login/member'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <HeroSection
          title="Finobytes"
          titleHighlight="Dashboard"
          description="A comprehensive role-based dashboard for managing users, merchants, and member transactions."
        />

        {/* Get Started Section */}
        <div className="mt-16">
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {roleCards.map((card, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  onClick={() => navigate(card.route)}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${card.colorScheme}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <div className={`w-8 h-8 text-${card.colorScheme}-600`}>
                      {card.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {card.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6">
                    {card.description}
                  </p>
                  
                  <button
                    className={`w-full py-3 px-6 bg-${card.colorScheme}-600 hover:bg-${card.colorScheme}-700 text-white font-medium rounded-lg transition-colors duration-200 group-hover:shadow-lg`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
            
            {/* Features Section */}
            <div className="mt-20">
              <SectionHeader
                title="Features"
                description="Everything you need to manage your business operations"
              />

              <div className="mt-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature, index) => (
                    <FeatureCard
                      key={index}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      colorScheme={feature.colorScheme}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
