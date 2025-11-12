import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  server: {
    proxy: {

      '/realms': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,


      },
      '/resources': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,

      },
    }
  },
});



