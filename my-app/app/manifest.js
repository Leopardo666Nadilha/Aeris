export default function manifest() {
  return {
    name: 'Aeris Finanças',
    short_name: 'Aeris',
    description: 'Seu app de finanças pessoais, simples e direto.',
    start_url: '/',
    display: 'standalone', // Abre como um app nativo
    background_color: 'var(--color-background)', // Cor de fundo da splash screen
    theme_color: 'var(--color-primary)', // Cor principal da sua marca
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
