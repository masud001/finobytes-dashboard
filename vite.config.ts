import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'esbuild',
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
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
