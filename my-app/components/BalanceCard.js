'use client';

import Link from 'next/link';
import { LuArrowDownLeft, LuArrowUpRight, LuChevronRight } from 'react-icons/lu';
import { useData } from '../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { currentMonthKey, formatMonthLabel, isInMonth, sumValues } from '../lib/finance';
import styles from './BalanceCard.module.css';

export default function BalanceCard() {
  const { balance, incomes, transactions } = useData();
  const { formatCurrency } = useCurrency();

  const month = currentMonthKey();
  const monthIncome = sumValues(incomes.filter((i) => isInMonth(i, month)));
  const monthExpense = sumValues(transactions.filter((t) => isInMonth(t, month)));

  return (
    <section className={styles.card} aria-label="Resumo do saldo">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.top}>
        <span className={styles.label}>Saldo total</span>
        <Link href="/transacoes" className={styles.link}>
          Histórico <LuChevronRight aria-hidden="true" />
        </Link>
      </div>
      <p className={`${styles.balance} ${balance < 0 ? styles.negative : ''}`}>{formatCurrency(balance)}</p>

      <div className={styles.month}>
        <span className={styles.monthLabel}>{formatMonthLabel(month)}</span>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={`${styles.statIcon} ${styles.in}`} aria-hidden="true">
              <LuArrowDownLeft />
            </span>
            <div>
              <span className={styles.statLabel}>Entradas</span>
              <span className={styles.statValue}>{formatCurrency(monthIncome)}</span>
            </div>
          </div>
          <div className={styles.stat}>
            <span className={`${styles.statIcon} ${styles.out}`} aria-hidden="true">
              <LuArrowUpRight />
            </span>
            <div>
              <span className={styles.statLabel}>Saídas</span>
              <span className={styles.statValue}>{formatCurrency(monthExpense)}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
