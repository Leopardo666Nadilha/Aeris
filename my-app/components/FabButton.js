'use client';

import { LuPlus } from 'react-icons/lu';
import styles from './FabButton.module.css';

export default function FabButton({ onClick }) {
  return (
    <button type="button" className={styles.fab} onClick={onClick} aria-label="Adicionar gasto ou recebimento">
      <LuPlus aria-hidden="true" />
      <span className={styles.label}>Adicionar</span>
    </button>
  );
}
