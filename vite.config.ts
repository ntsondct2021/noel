
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to avoid TypeScript type errors with the 'process' global in certain environments.
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    base: './',
    define: {
      // Giúp truyền biến môi trường từ .env vào App
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    },
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      strictPort: true,
    }
  };
});
