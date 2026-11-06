'use client';

import { useTheme } from './ThemeContext';
import { LuSun, LuMoon } from 'react-icons/lu';

// O ícone é escolhido via CSS (classe .dark no <html>) para não causar erro de hidratação.
export default function ThemeToggleButton({ className = 'icon-btn' }) {
  const { toggleTheme } = useTheme();

  return (
    <button type="button" onClick={toggleTheme} className={className} aria-label="Alternar tema claro/escuro">
      <span className="theme-icon-dark">
        <LuMoon />
      </span>
      <span className="theme-icon-light">
        <LuSun />
      </span>
    </button>
  );
}
