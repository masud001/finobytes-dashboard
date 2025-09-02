import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024, // Only compress files larger than 1KB
      deleteOriginFile: false, // Keep original files
    }),
    compression({
      algorithm: 'brotliCompress',
      ext: '.br',
      threshold: 1024,
      deleteOriginFile: false,
    }),
  ],
  base: '/', // Ensure base path is set for Netlify
  build: {
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          
          // Chart libraries (heavy)
          'charts-vendor': ['chart.js', 'react-chartjs-2'],
          
          // Authentication related
          'auth': [
            './src/store/slices/authSlice.ts', 
            './src/utils/authService.ts', 
            './src/utils/authSync.ts',
            './src/pages/Auth.tsx'
          ],
          
          // Dashboard pages (lazy loaded)
          'dashboard-admin': ['./src/pages/DashboardAdmin.tsx'],
          'dashboard-merchant': ['./src/pages/DashboardMerchant.tsx'],
          'dashboard-member': ['./src/pages/DashboardMember.tsx'],
          
          // Heavy components (lazy loaded)
          'lazy-components': [
            './src/components/DataTable.tsx',
            './src/components/SystemStats.tsx',
            './src/components/NotificationList.tsx',
            './src/components/LazyComponents.tsx'
          ],
          
          // Chart components (lazy loaded)
          'lazy-charts': [
            './src/components/ResponsiveCharts.tsx',
            './src/components/LazyCharts.tsx'
          ],
          
          // Form components
          'form-components': [
            './src/components/FormInput.tsx', 
            './src/components/FormButton.tsx',
            './src/components/ActionButton.tsx'
          ],
          
          // Utility components
          'utility-components': [
            './src/components/Layout.tsx',
            './src/components/Header.tsx',
            './src/components/Loader.tsx',
            './src/components/ProtectedRoute.tsx'
          ],
          
          // Data management
          'data-management': [
            './src/utils/dataManager.ts',
            './src/store/slices/dataSlice.ts'
          ],
          
          // Home page components
          'home-components': [
            './src/pages/Home.tsx',
            './src/components/HeroSection.tsx',
            './src/components/SectionHeader.tsx',
            './src/components/FeatureCard.tsx'
          ]
        },
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
