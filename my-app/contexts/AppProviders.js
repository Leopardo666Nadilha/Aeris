'use client';

import { CurrencyProvider } from './CurrencyContext';
import { DataProvider } from '../lib/DataContext';

// Único ponto onde o DataProvider é montado (antes ele também estava no layout,
// o que duplicava a assinatura de autenticação e as consultas ao Supabase).
export function AppProviders({ children }) {
  return (
    <DataProvider>
      <CurrencyProvider>{children}</CurrencyProvider>
    </DataProvider>
  );
}
