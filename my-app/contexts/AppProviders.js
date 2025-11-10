'use client';

import { CurrencyProvider } from './CurrencyContext';
import { DataProvider } from '../lib/DataContext'; // Ajuste o caminho se necessário

export function AppProviders({ children }) {
  return (
    <DataProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </DataProvider>
  );
}
