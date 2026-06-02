import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // Project is served from https://soliperso.github.io/clickygame/ on Pages.
  base: '/clickygame/',
  plugins: [react()],
  server: {
    open: true,
  },
});
