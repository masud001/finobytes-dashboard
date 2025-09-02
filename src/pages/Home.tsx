import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
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
      <div className="flex items-center justify-center min-h-screen" role="status" aria-live="polite">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" aria-hidden="true"></div>
        <span className="sr-only">Loading authentication status...</span>
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
    <>
      <Helmet>
        <title>Finobytes Dashboard - Role-Based Financial Management System</title>
        <meta name="description" content="A comprehensive role-based dashboard for managing users, merchants, and member transactions. Secure authentication, purchase management, and real-time analytics for financial operations." />
        <meta name="keywords" content="financial dashboard, role-based access, user management, merchant dashboard, member portal, purchase tracking, points system, real-time analytics" />
        <link rel="canonical" href="https://finobytes-dashboard.netlify.app/" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Finobytes Dashboard - Role-Based Financial Management System" />
        <meta property="og:description" content="A comprehensive role-based dashboard for managing users, merchants, and member transactions. Secure authentication, purchase management, and real-time analytics." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://finobytes-dashboard.netlify.app/" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Finobytes Dashboard - Role-Based Financial Management System" />
        <meta name="twitter:description" content="A comprehensive role-based dashboard for managing users, merchants, and member transactions. Secure authentication, purchase management, and real-time analytics." />
      </Helmet>
      
      <main id="main-content" className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <HeroSection
          title="Finobytes"
          titleHighlight="Dashboard"
          description="A comprehensive role-based dashboard for managing users, merchants, and member transactions."
        />

        {/* Get Started Section */}
        <section className="mt-16" aria-labelledby="get-started-heading">
          <h2 id="get-started-heading" className="sr-only">Get Started with Finobytes Dashboard</h2>
          
          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" role="list" aria-label="Available user roles">
              {roleCards.map((card, index) => (
                <article
                  key={index}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center hover:shadow-xl transition-all duration-300 cursor-pointer group focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                  onClick={() => navigate(card.route)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(card.route);
                    }
                  }}
                  tabIndex={0}
                  role="listitem"
                  aria-label={`${card.title}: ${card.description}`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${card.colorScheme}-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`} aria-hidden="true">
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
                    className={`w-full py-3 px-6 bg-${card.colorScheme}-600 hover:bg-${card.colorScheme}-700 focus:bg-${card.colorScheme}-700 text-white font-medium rounded-lg transition-colors duration-200 group-hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-${card.colorScheme}-500 focus:ring-offset-2`}
                    aria-label={`Get started with ${card.title}`}
                  >
                    Get Started
                  </button>
                </article>
              ))}
            </div>
            
            {/* Features Section */}
            <section className="mt-20" aria-labelledby="features-heading">
              <SectionHeader
                title="Features"
                description="Everything you need to manage your business operations"
              />

              <div className="mt-16">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Dashboard features">
                  {features.map((feature, index) => (
                    <div key={index} role="listitem">
                      <FeatureCard
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                        colorScheme={feature.colorScheme}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </section>
        </div>
      </main>
    </>
  );
};

export default Home;
