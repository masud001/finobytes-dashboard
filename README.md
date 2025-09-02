# Finobytes Dashboard

A comprehensive financial dashboard application with role-based access control for administrators, merchants, and members.

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=flat-square&logo=github)](https://github.com/masud001/finobytes-dashboard)
[![TypeScript](https://img.shields.io/badge/TypeScript-99.5%25-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.1-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=flat-square&logo=vite)](https://vitejs.dev/)

## 🚀 Performance Optimizations

### Code Splitting & Bundle Optimization

The application implements advanced code splitting strategies to optimize performance and reduce initial bundle size:

#### **Lazy Loading**
- **Page Components**: All dashboard and login pages are lazy-loaded using `React.lazy()`
- **Charts**: Chart components are loaded only when needed using Chart.js and react-chartjs-2
- **Route-based Splitting**: Each route loads its dependencies independently

#### **Bundle Chunking**
The build process creates optimized chunks through Vite's manual chunk configuration:

- **`react-vendor`**: React core libraries (React 19.1.1)
- **`router-vendor`**: React Router v7.8.2
- **`redux-vendor`**: Redux Toolkit v2.8.2
- **`charts-vendor`**: Chart.js v4.5.0 and react-chartjs-2 v5.3.0
- **`auth`**: Authentication utilities and services
- **`dashboard`**: Dashboard components and pages
- **`login`**: Login forms and authentication UI
- **`components`**: Reusable UI components
- **`charts`**: Chart components and responsive layouts

#### **Performance Benefits**
- **Initial Load**: Only essential code loads first
- **Navigation Speed**: Subsequent page loads are faster
- **Caching**: Vendor chunks can be cached separately
- **Bandwidth**: Users download only what they need

#### **Preloading Strategy**
- **Hover Preloading**: Routes preload on navigation intent
- **Delayed Loading**: Non-critical components load after initial render
- **Smart Caching**: Frequently used components are prioritized

## 🏗️ Architecture

### Core Technologies
- **React 19.1.1** with TypeScript 5.8.3
- **Redux Toolkit 2.8.2** for state management
- **React Router 7.8.2** for navigation
- **Tailwind CSS 4.1.12** for styling
- **Chart.js 4.5.0** with react-chartjs-2 5.3.0 for data visualization
- **Vite 7.1.2** for build tooling and development server

### Component Structure
- **Reusable Components**: FormInput, FormButton, DataTable, ActionButton, Loader, NotificationCard
- **Layout Components**: Layout, Header, SystemStats, ResponsiveCharts
- **Page Components**: Home, Auth (unified login/register), DashboardAdmin, DashboardMerchant, DashboardMember
- **Utility Hooks**: useForm, useTokenExpiry
- **Authentication Components**: ProtectedRoute, LoginCard

## 🔐 Authentication System

### Role-Based Access Control
- **Admin**: Full system access and user management
- **Merchant**: Store management and purchase approvals
- **Member**: Personal dashboard and purchase history

### Authentication Features
- **Unified Auth Component**: Single component handles all roles and authentication methods
- **Admin Registration**: Email + Password + Admin Code (ADMIN2024)
- **Merchant Registration**: Store Details (Store Name, Owner) + Email + Password
- **Member Registration**: Phone/Email + Password with dual login methods
- **OTP Simulation**: Member login with phone verification (demo OTP: 123456)
- **Token-based Authentication**: Role-prefixed fake tokens with 24-hour expiration
- **Cross-tab Synchronization**: Consistent auth state across browser tabs
- **Route Protection**: Automatic redirection for unauthorized access
- **Session Persistence**: Login state maintained across page refreshes
- **Real-time Validation**: Form validation with field-specific error handling

### Registration Requirements
- **Admin**: Email, password, admin registration code (ADMIN2024)
- **Merchant**: Store name, owner name, email, password
- **Member**: Full name, email, phone number, password
- **Validation**: Email format, password strength, required fields, phone format (Bangladesh), uniqueness checks

## 📊 Dashboard Features

### Admin Dashboard
- **System Statistics**: User counts, merchant counts, purchase metrics
- **Data Analytics**: Interactive charts and visualizations
- **User Management**: View and manage all users and merchants
- **Real-time Updates**: Live data with Redux state management
- **Dynamic Data**: Shows newly registered users and merchants automatically

### Merchant Dashboard
- **Purchase Management**: Approve/reject customer purchases
- **Customer Lookup**: Search and view customer information
- **Contribution Rate**: Set and manage contribution percentages
- **Store Analytics**: Performance metrics and trends
- **Live Customer Data**: Access to all registered member information

### Member Dashboard
- **Purchase History**: View all transactions with store names and approval status
- **Personal Statistics**: Individual performance metrics and point tracking
- **Point Tracking**: Monitor earned and spent points (1 point per $10 spent)
- **Real-time Updates**: Data updates immediately after registration
- **Interactive Charts**: Responsive charts showing spending patterns and trends

## 🎨 UI/UX Features

### Design System
- **Consistent Typography**: Unified font hierarchy and spacing
- **Theme-based Colors**: Role-specific color schemes (Blue for Admin, Green for Merchant, Purple for Member)
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Interactive Elements**: Hover effects, loading states, and smooth animations
- **Form Components**: Theme-aware FormInput and FormButton components
- **Data Visualization**: Responsive charts that adapt to screen size

## 💾 Data Management System

### Dynamic Data Persistence
- **Automatic Storage**: New registrations automatically saved to localStorage
- **Real-time Sync**: Data updates immediately across all dashboards
- **Fallback System**: Uses default data if localStorage is empty
- **Cross-tab Updates**: Changes synchronized across browser tabs

### Data Flow
1. **Registration**: User fills out registration form
2. **Validation**: Form data validated for completeness and format
3. **Storage**: Data saved to localStorage with unique IDs
4. **Dashboard Update**: All dashboards automatically show new data
5. **Persistence**: Data remains available across browser sessions

### Supported Data Types
- **Users**: Members with personal information and points
- **Merchants**: Store information with contact details
- **Purchases**: Transaction records with approval status
- **Notifications**: System alerts and updates

### Component Library
- **Form Components**: FormInput, FormButton with theme-aware styling and validation
- **Data Tables**: DataTable with sorting, searching, and pagination
- **Charts**: ResponsiveBarChart, ResponsiveLineChart, ResponsiveDoughnutChart, ResponsiveAreaChart
- **Action Buttons**: ActionButton with multiple variants (primary, secondary, danger, success, warning)
- **Notification System**: NotificationCard and NotificationList for system alerts
- **Layout Components**: Header, Layout, SystemStats for consistent page structure

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Available Routes
- **Public Routes**:
  - `/` - Home page with role selection
  - `/login/admin` - Admin login
  - `/login/merchant` - Merchant login  
  - `/login/member` - Member login
  - `/register/admin` - Admin registration
  - `/register/merchant` - Merchant registration
  - `/register/member` - Member registration

- **Protected Routes**:
  - `/dashboard/admin` - Admin dashboard (admin role required)
  - `/dashboard/merchant` - Merchant dashboard (merchant role required)
  - `/dashboard/member` - Member dashboard (member role required)

### Installation
```bash
# Clone the repository
git clone https://github.com/masud001/finobytes-dashboard.git
cd finobytes-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development
```bash
# Run in development mode
npm run dev

# Type checking
npm run type-check

# Build and preview
npm run build && npm run preview
```

## 📈 Performance Metrics

### Bundle Analysis
- **Total Size**: Optimized from 648.35 kB to multiple smaller chunks
- **Initial Load**: Reduced by ~60% through code splitting
- **Caching Efficiency**: Vendor chunks can be cached long-term
- **Load Time**: Faster navigation between routes

### Optimization Techniques
- **Tree Shaking**: Unused code eliminated from bundles
- **Minification**: ESBuild for fast and efficient minification
- **Chunk Splitting**: Manual chunk configuration for optimal loading
- **Preloading**: Intelligent resource loading based on user behavior

## 🔧 Configuration

### Vite Configuration
The build process is optimized through:
- **Manual Chunk Splitting**: Strategic separation of vendor and feature code
- **ESBuild Minification**: Fast and efficient code compression
- **Asset Optimization**: Organized file structure for better caching
- **Dependency Optimization**: Selective inclusion of required packages

### Environment Variables
```bash
# Development
VITE_API_URL=http://localhost:3000
VITE_ENV=development

# Production
VITE_API_URL=https://api.finobytes.com
VITE_ENV=production
```

## 🧪 Testing

### Test Scenarios

#### Authentication Testing
1. **Admin Registration & Login**:
   - Navigate to `/register/admin`
   - Fill in: Name, Email, Password, Admin Code (ADMIN2024)
   - Should redirect to `/dashboard/admin`

2. **Merchant Registration & Login**:
   - Navigate to `/register/merchant`
   - Fill in: Store details, owner info, contact details, password
   - Should redirect to `/dashboard/merchant`

3. **Member Registration & Login**:
   - Navigate to `/register/member`
   - Fill in: Personal details, contact info, password
   - Should redirect to `/dashboard/member`

4. **Member OTP Login**:
   - Navigate to `/login/member`
   - Enter phone number (e.g., 01710000001)
   - Use OTP: 123456
   - Should redirect to `/dashboard/member`

#### Demo Credentials
- **Admin**: admin@finobytes.com / admin123 / Code: ADMIN2024
- **Merchant**: mizan@shopone.com / shopone123
- **Member**: 
  - Email: alice@example.com / alice123
  - Phone: +8801710000001 / OTP: 123456

### Available Scripts
```bash
# Development
npm run dev          # Start development server
npm start           # Start development server (alias)

# Build
npm run build       # Build for production
npm run preview     # Preview production build

# Code Quality
npm run lint        # Run ESLint
npm run type-check  # TypeScript type checking
```

## 📝 Contributing

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Automatic code formatting
- **Husky**: Pre-commit hooks for quality assurance

### Development Workflow
1. Create feature branch
2. Implement changes with tests
3. Ensure all tests pass
4. Submit pull request
5. Code review and approval

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔧 LocalStorage Keys

The application uses the following localStorage keys for data persistence:

### Authentication
- `auth-token`: User authentication token
- `auth-role`: User role (admin/merchant/member)
- `auth-user`: User profile data (JSON string)
- `auth-expiry`: Token expiration timestamp

### Application Data
- `users`: User data including newly registered members
- `merchants`: Merchant data including newly registered stores
- `app-data`: Application state including users, merchants, purchases, notifications
- `purchases`: Purchase data for merchants
- `notifications`: Notification data for merchants
- `contributionRate`: Merchant contribution rate setting

### Data Persistence
- **New Users**: Automatically saved to localStorage and appear in all dashboards
- **New Merchants**: Automatically saved to localStorage and appear in admin dashboard
- **Real-time Updates**: Data changes are reflected immediately across all dashboards
- **Fallback Data**: Uses default data files if localStorage is empty

## 🤝 Support

For support and questions:
- **Issues**: Create an issue in the [repository](https://github.com/masud001/finobytes-dashboard/issues)
- **Documentation**: Check the inline code documentation
- **Community**: Join our developer community

## 📁 Repository

- **GitHub**: [https://github.com/masud001/finobytes-dashboard](https://github.com/masud001/finobytes-dashboard)
- **Languages**: TypeScript (99.5%), Other (0.5%)
- **License**: MIT License

---

**Built with ❤️ using modern web technologies and performance best practices.**
