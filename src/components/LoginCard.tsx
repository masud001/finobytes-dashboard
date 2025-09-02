import { Link } from 'react-router-dom';

interface LoginCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  buttonText: string;
  colorScheme: 'blue' | 'green' | 'purple';
  isRegistration?: boolean;
}

const LoginCard: React.FC<LoginCardProps> = ({
  title,
  description,
  icon,
  to,
  buttonText,
  colorScheme,
  isRegistration = false
}) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-500',
      button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
    },
    green: {
      iconBg: 'bg-green-500',
      button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    },
    purple: {
      iconBg: 'bg-purple-500',
      button: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'
    }
  };

  const { iconBg, button } = colorClasses[colorScheme];

  // If it's a registration card, render a simpler version
  if (isRegistration) {
    return (
      <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
        <div className="p-4">
          <div className="mt-2">
            <Link
              to={to}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className={`w-12 h-12 ${iconBg} rounded-md flex items-center justify-center`}>
              <div className="w-6 h-6 text-white">
                {icon}
              </div>
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        <div className="mt-6">
          <Link
            to={to}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${button} focus:outline-none focus:ring-2 focus:ring-offset-2`}
          >
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginCard;
