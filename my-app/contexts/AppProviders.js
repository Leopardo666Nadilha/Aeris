'use client';

import { CurrencyProvider } from './CurrencyContext';
import { DataProvider } from '../lib/DataContext';

export function AppProviders({ children }) {
  return (
    <DataProvider>
      <CurrencyProvider>
        {children}
      </CurrencyProvider>
    </DataProvider>
  );
}
