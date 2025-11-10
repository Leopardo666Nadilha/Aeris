'use client';

import Link from 'next/link';
import { useData } from '../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './BalanceCard.module.css';

export default function BalanceCard() {
  const { balance } = useData();
  const { formatCurrency } = useCurrency();

  return (
    // O Link agora envolve o conteúdo interno, usando as classes CSS corretas
    <Link href="/transacoes" className={styles.balanceCardLink}>
      <div className={styles.balanceCard}>
        <p className={styles.balanceLabel}>Saldo Total</p>
        <h1>{formatCurrency(balance)}</h1>
      </div>
    </Link>
  );
}
