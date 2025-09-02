import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Responsive chart options
const getChartOptions = (title: string, isMobile: boolean, isTablet: boolean) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: (isMobile ? 'bottom' : 'top') as 'bottom' | 'top',
      labels: {
        padding: isMobile ? 10 : 20,
        font: {
          size: isMobile ? 10 : isTablet ? 12 : 14,
        },
      },
    },
    title: {
      display: true,
      text: title,
      font: {
        size: isMobile ? 14 : isTablet ? 16 : 18,
        weight: 'bold' as const,
      },
      padding: isMobile ? 10 : 20,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: 'white',
      bodyColor: 'white',
      borderColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: true,
      titleFont: {
        size: isMobile ? 12 : 14,
      },
      bodyFont: {
        size: isMobile ? 11 : 13,
      },
    },
  },
  scales: {
    x: {
      ticks: {
        font: {
          size: isMobile ? 10 : isTablet ? 11 : 12,
        },
        maxRotation: isMobile ? 45 : 0,
      },
      grid: {
        display: !isMobile,
      },
    },
    y: {
      ticks: {
        font: {
          size: isMobile ? 10 : isTablet ? 11 : 12,
        },
      },
      grid: {
        display: true,
      },
    },
  },
});

// Responsive Bar Chart
export const ResponsiveBarChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = ({ data, title, className = '' }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Bar
          data={data}
          options={getChartOptions(title, isMobile, isTablet)}
        />
      </div>
    </div>
  );
};

// Responsive Line Chart
export const ResponsiveLineChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = ({ data, title, className = '' }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Line
          data={data}
          options={{
            ...getChartOptions(title, isMobile, isTablet),
            elements: {
              point: {
                radius: isMobile ? 2 : isTablet ? 3 : 4,
                hoverRadius: isMobile ? 4 : isTablet ? 5 : 6,
              },
              line: {
                tension: 0.4,
                borderWidth: isMobile ? 2 : 3,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// Responsive Doughnut Chart
export const ResponsiveDoughnutChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = ({ data, title, className = '' }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Doughnut
          data={data}
          options={{
            ...getChartOptions(title, isMobile, isTablet),
            cutout: isMobile ? '60%' : isTablet ? '65%' : '70%',
          }}
        />
      </div>
    </div>
  );
};

// Responsive Area Chart
export const ResponsiveAreaChart: React.FC<{
  data: any;
  title: string;
  className?: string;
}> = ({ data, title, className = '' }) => {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (
    <div className={`w-full ${className}`}>
      <div className="h-64 sm:h-72 md:h-80 lg:h-96">
        <Line
          data={{
            ...data,
            datasets: data.datasets.map((dataset: any) => ({
              ...dataset,
              fill: true,
              backgroundColor: dataset.backgroundColor + '40',
            })),
          }}
          options={{
            ...getChartOptions(title, isMobile, isTablet),
            elements: {
              point: {
                radius: isMobile ? 2 : isTablet ? 3 : 4,
                hoverRadius: isMobile ? 4 : isTablet ? 5 : 6,
              },
              line: {
                tension: 0.4,
                borderWidth: isMobile ? 2 : 3,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

// Chart Grid Component for responsive layout
export const ResponsiveChartGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8 ${className}`}>
      {children}
    </div>
  );
};

// Single Chart Container for full-width charts
export const ChartContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`w-full h-full p-4 md:p-6 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};
