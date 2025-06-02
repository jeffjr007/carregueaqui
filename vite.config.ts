
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import fs from 'fs';

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd());

  // Configuração HTTPS para desenvolvimento (opcional)
  const httpsConfig = mode === 'development' && process.env.HTTPS === 'true' ? {
    https: {
      key: fs.existsSync('./localhost-key.pem') ? fs.readFileSync('./localhost-key.pem') : undefined,
      cert: fs.existsSync('./localhost.pem') ? fs.readFileSync('./localhost.pem') : undefined,
    }
  } : {};

  return {
    server: {
      host: "::",
      port: 8080,
      ...httpsConfig,
      // O middleware de segurança será configurado em server.js
    },
    preview: {
      ...httpsConfig,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      mode === 'production' && sentryVitePlugin({
        org: env.VITE_SENTRY_ORG || "your-org",
        project: env.VITE_SENTRY_PROJECT || "your-project",
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
      }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/tests/setup.ts',
    },
    define: {
      // Garante que as variáveis de ambiente sejam seguras
      __APP_ENV__: JSON.stringify({
        NODE_ENV: mode,
        appVersion: process.env.npm_package_version,
        isSecure: process.env.HTTPS === 'true' || mode === 'production',
      }),
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Separa bibliotecas pesadas em chunks separados
            mapbox: ['mapbox-gl'],
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio']
          }
        }
      }
    },
  };
});
