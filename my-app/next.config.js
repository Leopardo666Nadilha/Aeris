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

// swcMinify foi removido: o SWC já é o minificador padrão desde o Next 15.
const nextConfig = {};

module.exports = withPWA(nextConfig);
