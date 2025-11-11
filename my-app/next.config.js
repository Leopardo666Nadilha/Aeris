/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  // Configurações para otimizar o build e evitar o aviso de "big strings"
  runtimeCaching: require('next-pwa/cache'),
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  swcMinify: true, // Habilita o minificador SWC do Next.js, que é mais rápido
};

module.exports = withPWA(nextConfig);
