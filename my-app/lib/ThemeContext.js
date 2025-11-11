'use client';

import { createContext, useState, useContext, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Inicializa o estado do tema lendo do DOM (que já foi setado pelo ThemeScript)
  // ou um valor padrão para SSR.
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      // Lê a classe aplicada pelo ThemeScript ou assume 'dark' como padrão
      return root.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark'; // Tema padrão para SSR ou quando window não está disponível
  });

  // Este efeito lida com todos os efeitos colaterais quando o estado 'theme' muda
  useEffect(() => {
    if (typeof window !== 'undefined' && theme) { // Garante que estamos no cliente e o tema está definido
      const root = document.documentElement;
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');

      // 1. Atualiza a classe no elemento <html>
      root.classList.remove('light', 'dark');
      root.classList.add(theme);

      // 2. Atualiza a meta tag theme-color
      const rootStyles = getComputedStyle(root); // Pega os estilos computados APÓS a classe ser aplicada
      const newColor = rootStyles.getPropertyValue('--color-primary').trim();
      if (metaThemeColor && newColor) {
        metaThemeColor.setAttribute('content', newColor);
      }

      // 3. Salva a preferência no localStorage (adiado para otimização de INP)
      setTimeout(() => {
        localStorage.setItem('theme', theme);
      }, 0);
    }
  }, [theme]); // Este efeito será reexecutado sempre que o estado 'theme' mudar

  // Função para alternar o tema - agora ela apenas atualiza o estado
  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  }, []); // useCallback para memorizar a função e evitar re-renderizações desnecessárias

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
