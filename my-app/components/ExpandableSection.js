'use client';

import { useState, useEffect } from 'react';
import styles from './ExpandableSection.module.css';
import {
  MdOutlineKeyboardDoubleArrowDown,
  MdOutlineKeyboardDoubleArrowUp,
} from 'react-icons/md';

export default function ExpandableSection({ title, children }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  
  useEffect(() => {
    // Verifica se a tela é maior que o breakpoint de desktop
    if (window.innerWidth >= 1200) {
      // Define o estado como expandido
      setIsExpanded(true);
    }
  }, []);

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
