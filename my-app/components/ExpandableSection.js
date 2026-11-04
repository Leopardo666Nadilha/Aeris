'use client';

import { useState, useSyncExternalStore } from 'react';
import styles from './ExpandableSection.module.css';
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from 'react-icons/md';

// Breakpoint de desktop: a seção começa expandida em telas a partir de 1200px
const DESKTOP_QUERY = '(min-width: 1200px)';

const subscribeToDesktop = (callback) => {
  const mql = window.matchMedia(DESKTOP_QUERY);
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

export default function ExpandableSection({ title, children }) {
  const isDesktop = useSyncExternalStore(
    subscribeToDesktop,
    () => window.matchMedia(DESKTOP_QUERY).matches,
    () => false // No servidor, sempre começa recolhido
  );
  // null = o usuário ainda não clicou; segue o padrão do tamanho da tela
  const [userExpanded, setUserExpanded] = useState(null);
  const isExpanded = userExpanded ?? isDesktop;

  const handleToggle = () => {
    setUserExpanded(!isExpanded);
  };

  return (
    <div className={styles.expandableSection}>
      <div className={styles.sectionHeader}>
        <span className={styles.headerTitle}>{title}</span>
        <button
          className={styles.toggleButton}
          onClick={handleToggle}
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <MdOutlineKeyboardDoubleArrowUp />
          ) : (
            <MdOutlineKeyboardDoubleArrowDown />
          )}
        </button>
      </div>
      <div
        className={`${styles.sectionContent} ${isExpanded ? styles.expanded : ""}`}
      >
        <div className={styles.contentInner}>{children}</div> {/* Renderiza children diretamente */}
      </div>
    </div>
  );
}
