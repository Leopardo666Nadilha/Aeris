'use client';

import { useEffect } from 'react';

// Registra o service worker (public/sw.js) para o PWA. Desativado em desenvolvimento,
// como fazia o next-pwa, para não servir arquivos antigos do cache durante o dev.
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js', { scope: '/', updateViaCache: 'none' })
      .catch((error) => console.error('Falha ao registrar o service worker:', error));
  }, []);

  return null;
}
