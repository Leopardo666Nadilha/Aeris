import { Inter, Merriweather } from 'next/font/google';
import Header from '../components/Header';
import AppLayout from '../components/AppLayout';
import './globals.css';
import { ThemeProvider } from '../lib/ThemeContext';
import { DataProvider } from '../lib/DataContext';
import ThemeScript from '../lib/ThemeScript';
import { AppProviders } from '@/contexts/AppProviders';

// Configuração da fonte principal (Inter)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

// Configuração da fonte secundária (Merriweather) para títulos
const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-merriweather',
});

export const metadata = {
  title: 'Aeris Finanças',
  description: 'Seu app de finanças pessoais.',
  themeColor: '#d95f43',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeScript />
        <ThemeProvider>
          <DataProvider> {/* Envolva com o DataProvider */}
            <div className={inter.className}>
            <AppProviders> {/* 2. Use o AppProviders para envolver tudo */}
              <Header />
              <AppLayout>
                <main className='main-content'>{children}</main>
              </AppLayout>
              </AppProviders>
            </div>
          </DataProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
