import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // better to point to src folder
      },
    },
    build: {
      outDir: path.resolve(__dirname, '../dist'),
      emptyOutDir: true,
      modulePreload: {
        resolveDependencies: (_filename, deps, context) => {
          if (context.hostType !== 'html') return deps;
          return deps.filter((dep) => !/(firebase|charts)-/.test(dep));
        },
      },
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return undefined;
            if (id.includes('@firebase') || id.includes('firebase')) return 'firebase';
            if (id.includes('recharts')) return 'charts';
            return undefined;
          },
        },
      },
    },
    server: {
      hmr: true, // keep Hot Module Replacement enabled
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          secure: false,
        },
      },
      watch: {
        usePolling: false, // prevents excessive reloads
        interval: 1000,    // reduces flickering
      },
      port: 3000, // specify the port for the dev server
      host: '0.0.0.0', // allows access from LAN if needed
    },
  };
});
