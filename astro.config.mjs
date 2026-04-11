import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL || 'https://travelhood.es',
  output: 'static',
  trailingSlash: 'always',
  adapter: vercel(),
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/404') &&
        !page.includes('/redireccion-whatsapp'),
    }),
  ],
  build: {
    concurrency: 1,
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ['date-fns', 'date-fns/locale/es', 'lucide-react'],
    },
    ...(process.env.NODE_ENV !== 'production' ? {
      server: {
        allowedHosts: ['.ngrok-free.app'],
      },
    } : {}),
  },
});
