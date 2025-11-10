'use client';
import styles from './FabButton.module.css';
import { MdAdd } from 'react-icons/md';

export default function FabButton({ onClick }) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label='Adicionar novo item'>
      <MdAdd size={24} />
    </button>
  );
}