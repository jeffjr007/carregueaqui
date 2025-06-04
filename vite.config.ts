import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { sentryVitePlugin } from "@sentry/vite-plugin";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [
      react(),
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
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            mapbox: ['mapbox-gl'],
            react: ['react', 'react-dom', 'react-router-dom'],
            ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-aspect-ratio']
          }
        }
      }
    },
  };
});
