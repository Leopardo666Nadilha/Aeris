'use client';

import { useMemo, useState } from 'react';
import BalanceCard from '../components/BalanceCard';
import DonutGraph from '../components/DonutGraph';
import RecentTransactions from '../components/RecentTransactions';
import Budgets from '../components/Budgets';
import SegmentedControl from '../components/SegmentedControl';
import { PageLoader } from '../components/PageHeader';
import { useData } from '../lib/DataContext';
import { currentMonthKey, isInMonth, spendingByCategory } from '../lib/finance';
import styles from './page.module.css';

const PERIODS = [
  { value: 'month', label: 'Este mês' },
  { value: 'all', label: 'Tudo' },
];

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

export default function HomePage() {
  const { transactions, loading, user } = useData();
  const [period, setPeriod] = useState('month');

  const chartData = useMemo(() => {
    const month = currentMonthKey();
    const source = period === 'month' ? transactions.filter((t) => isInMonth(t, month)) : transactions;
    return spendingByCategory(source);
  }, [transactions, period]);

  if (loading) return <PageLoader />;

  const firstName = (user?.user_metadata?.full_name || '').split(' ')[0];

  return (
    <div className={`${styles.page} fade-up`}>
      <h1 className={styles.greeting} suppressHydrationWarning>
        {greeting()}
        {firstName ? `, ${firstName}` : ''}
      </h1>

      <div className={styles.topGrid}>
        <BalanceCard />

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Gastos por categoria</h2>
            <SegmentedControl options={PERIODS} value={period} onChange={setPeriod} label="Período" size="sm" />
          </div>
          <DonutGraph data={chartData} />
        </section>
      </div>

      <div className={styles.bottomGrid}>
        <RecentTransactions type="expense" />
        <Budgets />
        <RecentTransactions type="income" />
      </div>
    </div>
  );
}
