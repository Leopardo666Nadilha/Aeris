/** @type {import('next').NextConfig} */

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  // desabilite em desenvolvimento para evitar problemas de cache
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // ...outras configurações do seu Next.js
};

module.exports = withPWA(nextConfig);
