import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode
  const env = loadEnv(mode, process.cwd(), '');
  const backendTarget = env.VITE_API_BASE_URL || 'http://127.0.0.1:3000';

  return {
    plugins: [react()],
    server: {
      host: '127.0.0.1',
      port: 3001,
      strictPort: false,
      proxy: {
        '/events': {
          target: backendTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
