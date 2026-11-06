import { Geist, Instrument_Serif } from 'next/font/google';
import Script from 'next/script';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import ServiceWorkerRegister from '../components/ServiceWorkerRegister';
import { ThemeProvider } from '../lib/ThemeContext';
import { AppProviders } from '@/contexts/AppProviders';
import './globals.css';

// Fonte principal da interface
const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

// Fonte de destaque para valores e títulos grandes
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-instrument',
});

export const metadata = {
  title: 'Aeris Finanças',
  description: 'Seu app de finanças pessoais.',
  appleWebApp: { capable: true, title: 'Aeris', statusBarStyle: 'default' },
};

export const viewport = {
  themeColor: '#12100f',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${geist.variable} ${instrument.variable}`} suppressHydrationWarning>
      <body>
        {/* Aplica o tema salvo antes do React carregar, evitando o "flicker" do tema */}
        <Script id="theme-switcher" strategy="beforeInteractive">
          {`try{document.documentElement.classList.add(localStorage.getItem('theme')||'dark')}catch(e){document.documentElement.classList.add('dark')}`}
        </Script>
        <ServiceWorkerRegister />
        <ThemeProvider>
          <AppProviders>
            <div className="app-root">
              <Header />
              <AppLayout>{children}</AppLayout>
            </div>
          </AppProviders>
        </ThemeProvider>
      </body>
    </html>
  );
}
