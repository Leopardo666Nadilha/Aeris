export default function manifest() {
  return {
    name: 'Aeris Finanças',
    short_name: 'Aeris',
    description: 'Seu app de finanças pessoais, simples e direto.',
    start_url: '/',
    display: 'standalone', // Abre como um app nativo
    background_color: '#f5f2ec', // Cor de fundo da splash screen
    theme_color: '#d95f43', // Cor principal
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
