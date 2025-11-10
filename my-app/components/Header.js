"use client";

import Link from "next/link";
import ThemeToggleButton from "../lib/ThemeToggleButton";
import { useTheme } from "../lib/ThemeContext";
import {
  FcBullish,
  FcMoneyTransfer,
  FcPortraitMode,
  FcNightPortrait,
} from "react-icons/fc";
import "./Header.css"; // Importação correta para CSS global no componente

const Header = () => { // Remove a prop showBackButton
  const { theme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <Link href="/" className="logo">
          <span>Aeris</span>
        </Link>
        <nav className="navigation">
          {/* Ícones de navegação */}
          <Link href="/dashboard">
            <FcBullish />
          </Link>
          <Link href="/transacoes">
            <FcMoneyTransfer />
          </Link>
          <Link href="/perfil">
            {theme === "light" ? <FcPortraitMode /> : <FcNightPortrait />}
          </Link>
          <ThemeToggleButton />
        </nav>
      </div>
    </header>
  );
};

export default Header;
