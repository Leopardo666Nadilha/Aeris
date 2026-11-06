'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

const readThemeFromDom = () =>
  typeof document !== 'undefined' && !document.documentElement.classList.contains('dark') ? 'light' : 'dark';

export function ThemeProvider({ children }) {
  // O script do layout já aplicou a classe no <html>; partimos dela.
  // Componentes que dependem do tema na renderização devem preferir CSS
  // (classes .theme-icon-*) para não divergir do HTML gerado no servidor.
  const [theme, setTheme] = useState(readThemeFromDom);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Mantém a cor da barra do navegador alinhada ao fundo do tema
    const meta = document.querySelector('meta[name="theme-color"]');
    const bg = getComputedStyle(root).getPropertyValue('--color-bg').trim();
    if (meta && bg) meta.setAttribute('content', bg);

    try {
      localStorage.setItem('theme', theme);
    } catch {
      // localStorage indisponível (modo privado etc.)
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
