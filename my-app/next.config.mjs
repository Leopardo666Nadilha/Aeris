/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // O service worker precisa ser sempre revalidado para que atualizações cheguem aos usuários
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ];
  },
};

export default nextConfig;
