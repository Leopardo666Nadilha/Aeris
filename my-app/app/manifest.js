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
        src: '/icons/android/android-launchericon-48-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/icons/android/android-launchericon-72-72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/icons/android/android-launchericon-96-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/icons/android/android-launchericon-144-144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/icons/android/android-launchericon-192-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/ios/180.png', // iPhone retina
        sizes: '180x180',
        type: 'image/png',
      },
      {
        src: '/icons/ios/192.png', // Para compatibilidade geral, se não for o mesmo que android-192
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/windows11/Square150x150Logo.scale-200.png', // Exemplo para Windows
        sizes: '300x300',
        type: 'image/png',
      },
      {
        src: '/icons/android/android-launchericon-512-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/ios/1024.png', // Ícone de alta resolução para iOS e outros usos
        sizes: '1024x1024',
        type: 'image/png',
      },
    ],
  };
}
