'use client';

import BalanceCard from '../components/BalanceCard';
import ExpandableSection from '../components/ExpandableSection';
import DonutGraph from '../components/DonutGraph';
import styles from './page.module.css';
import { useData } from '../lib/DataContext';
import RecentExpenses from '../components/RecentExpenses';
import Budgets from '../components/Budgets';
import RecentIncomes from '../components/RecentIncomes';

export default function HomePage() {
  const { transactions } = useData();

  // Agrupar transações por categoria para o gráfico de donut
  const aggregatedTransactions = transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(item => item.label === transaction.label);
    if (existingCategory) {
      existingCategory.value += transaction.value;
    } else {
      acc.push({ label: transaction.label, value: transaction.value });
    }
    return acc;
  }, []);

  return (
    // O <main> já é fornecido pelo layout.js e estilizado pelo globals.css
    // Adicionamos um wrapper para garantir que todos os elementos da página
    // partilhem o mesmo contexto de largura e alinhamento.
    <div className={styles.contentWrapper}>
      <BalanceCard />
      <DonutGraph data={aggregatedTransactions} />
      <div className={styles.expandableSectionsContainer}>
        <ExpandableSection title="Gastos Recentes">
          <RecentExpenses />
        </ExpandableSection>
        <ExpandableSection title="Metas e Orçamentos">
          <Budgets />
        </ExpandableSection>
        <ExpandableSection title="Rendas do mês">
          <RecentIncomes />
        </ExpandableSection>
      </div>
    </div>
  );
}