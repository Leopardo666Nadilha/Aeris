'use client';

import React, { createContext, useState, useContext, useSyncExternalStore } from 'react';

const STORAGE_KEY = 'user_currency_preference';

// Mantém a moeda sincronizada entre abas quando o localStorage muda em outra janela
const subscribeToStorage = (callback) => {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
};

// Definição das moedas suportadas com seus locais e símbolos
const supportedCurrencies = {
  BRL: { locale: 'pt-BR', symbol: 'R$' },
  USD: { locale: 'en-US', symbol: '$' },
  EUR: { locale: 'de-DE', symbol: '€' },
  GBP: { locale: 'en-GB', symbol: '£' },
};

// Valor padrão para o contexto, usado quando não há um Provider
const defaultContextValue = {
  currency: 'BRL',
  setCurrency: () => console.warn('setCurrency chamado fora do CurrencyProvider'),
  formatCurrency: (value) => `R$ ${Number(value).toFixed(2)}`, // Formatação de fallback
  supportedCurrencies: supportedCurrencies,
};
const CurrencyContext = createContext(defaultContextValue);

// Hook customizado para facilitar o uso do contexto em componentes
export const useCurrency = () => useContext(CurrencyContext);

export const CurrencyProvider = ({ children }) => {
  // No servidor (e na hidratação) usa sempre 'BRL'; no cliente, lê a preferência salva.
  const storedCurrency = useSyncExternalStore(
    subscribeToStorage,
    () => localStorage.getItem(STORAGE_KEY),
    () => null
  );
  const [selectedCurrency, setSelectedCurrency] = useState(null);
  const currency =
    selectedCurrency ?? (supportedCurrencies[storedCurrency] ? storedCurrency : 'BRL');

  // Salva a preferência no localStorage sempre que o usuário escolhe uma moeda.
  const setCurrency = (newCurrency) => {
    setSelectedCurrency(newCurrency);
    localStorage.setItem(STORAGE_KEY, newCurrency);
  };

  /**
   * Formata um valor numérico para a moeda selecionada.
   * Não realiza conversão, apenas formata o número com o símbolo e o local corretos.
   * @param {number} value - O valor numérico a ser formatado.
   * @returns {string} O valor formatado como string.
   */
  const formatCurrency = (value) => {
    const { locale } = supportedCurrencies[currency];

    // Usa Intl.NumberFormat para formatar o valor com base no locale e na moeda selecionada
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(value);
  };

  const value = {
    currency,
    setCurrency,
    formatCurrency,
    supportedCurrencies,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};
