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
- **Charts**: Chart components are loaded only when needed
- **Route-based Splitting**: Each route loads its dependencies independently

#### **Bundle Chunking**
The build process creates optimized chunks:

- **`react-vendor`** (11.84 kB): React core libraries
- **`router-vendor`** (34.55 kB): React Router
- **`redux-vendor`** (29.56 kB): Redux Toolkit
- **`charts-vendor`** (332.71 kB): Recharts library
- **`auth`** (6.75 kB): Authentication utilities
- **`dashboard`** (25.12 kB): Dashboard components
- **`login`** (18.01 kB): Login forms
- **`components`** (10.61 kB): Reusable UI components
- **`charts`** (4.29 kB): Chart components

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
- **React 18** with TypeScript
- **Redux Toolkit** for state management
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization

### Component Structure
- **Reusable Components**: FormInput, FormButton, DataTable, ActionButton
- **Layout Components**: Layout, SystemStats, Charts
- **Page Components**: Home, Login forms, Dashboards
- **Utility Hooks**: useForm, useTokenExpiry

## 🔐 Authentication System

### Role-Based Access Control
- **Admin**: Full system access and user management
- **Merchant**: Store management and purchase approvals
- **Member**: Personal dashboard and purchase history

### Authentication Features
- **Login & Registration**: Separate pages for each role
- **Admin Registration**: Email + Password + Admin Code (ADMIN2024)
- **Merchant Registration**: Store Details + Password
- **Member Registration**: Phone/Email + Password
- **OTP Simulation**: Member login with phone verification
- **Token-based Authentication**: JWT-style tokens with expiration
- **Cross-tab Synchronization**: Consistent auth state across browser tabs
- **Route Protection**: Automatic redirection for unauthorized access
- **Session Persistence**: Login state maintained across page refreshes

### Registration Requirements
- **Admin**: Full name, email, password, admin registration code
- **Merchant**: Store name, owner name, email, phone, address, password
- **Member**: Full name, email, phone, password
- **Validation**: Email format, password strength, required fields, phone format (Bangladesh)

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
- **Purchase History**: View all transactions and points
- **Personal Statistics**: Individual performance metrics
- **Point Tracking**: Monitor earned and spent points
- **Real-time Updates**: Data updates immediately after registration

### Member Dashboard
- **Purchase History**: View all transactions and points
- **Personal Statistics**: Individual performance metrics
- **Point Tracking**: Monitor earned and spent points

## 🎨 UI/UX Features

### Design System
- **Consistent Typography**: Unified font hierarchy and spacing
- **Theme-based Colors**: Role-specific color schemes
- **Responsive Design**: Mobile-first approach with breakpoint optimization
- **Interactive Elements**: Hover effects, loading states, and animations

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
- **Form Components**: Validated inputs with error handling
- **Data Tables**: Sortable, searchable, and paginated tables
- **Charts**: Multiple chart types with responsive layouts
- **Action Buttons**: Consistent button styles with variants

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
- **Admin**: admin@finobytes.com / admin123
- **Merchant**: mizan@shopone.com / shopone123
- **Member**: Phone: 01710000001 / OTP: 123456

### Available Scripts
```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Type checking
npm run type-check
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
