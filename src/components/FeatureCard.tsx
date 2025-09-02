interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  colorScheme: 'blue' | 'green' | 'purple' | 'yellow';
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  colorScheme
}) => {
  const colorClasses = {
    blue: {
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    green: {
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    purple: {
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    yellow: {
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  };

  const { iconBg, iconColor } = colorClasses[colorScheme];

  return (
    <div className="text-center">
      <div className={`mx-auto h-12 w-12 ${iconBg} rounded-lg flex items-center justify-center`}>
        <div className={`h-6 w-6 ${iconColor}`}>
          {icon}
        </div>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
};

export default FeatureCard;
