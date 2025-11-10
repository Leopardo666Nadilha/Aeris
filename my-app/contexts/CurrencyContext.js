'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';

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
  // Inicializa SEMPRE com o valor padrão do servidor.
  const [currency, setCurrency] = useState('BRL');

  // Após a montagem no cliente, busca a preferência do localStorage.
  useEffect(() => {
    const storedCurrency = localStorage.getItem('user_currency_preference');
    if (storedCurrency && supportedCurrencies[storedCurrency]) {
      setCurrency(storedCurrency);
    }
  }, []);

  // Salva a preferência no localStorage sempre que a moeda mudar.
  useEffect(() => {
    if (typeof window !== 'undefined') { // Verifica se está no ambiente do navegador
      localStorage.setItem('user_currency_preference', currency);
    }
  }, [currency]);

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
