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
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
          'charts-vendor': ['chart.js', 'react-chartjs-2'],
          'auth': ['./src/store/slices/authSlice.ts', './src/utils/authService.ts', './src/pages/Auth.tsx'],
          'dashboard': ['./src/pages/DashboardAdmin.tsx', './src/pages/DashboardMerchant.tsx', './src/pages/DashboardMember.tsx'],
          'components': ['./src/components/FormInput.tsx', './src/components/FormButton.tsx', './src/components/DataTable.tsx'],
          'charts': ['./src/components/ResponsiveCharts.tsx'],
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
