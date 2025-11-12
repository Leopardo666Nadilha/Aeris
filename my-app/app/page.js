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
  const { transactions, loading } = useData(); // 1. Obtenha o estado 'loading' do contexto

  // 2. Se os dados ainda estiverem carregando, exiba um indicador de carregamento.
  //    Isso impede que os componentes filhos renderizem com dados vazios.
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Carregando seus dados...</p>
      </div>
    );
  }

  // 1. Agrupar transações por categoria
  let aggregated = transactions.reduce((acc, transaction) => {
    const existingCategory = acc.find(item => item.category_name === transaction.category_name);
    if (existingCategory) {
      existingCategory.value += transaction.value;
    } else {
      acc.push({ category_name: transaction.category_name, value: transaction.value });
    }
    return acc;
  }, []);

  // 2. Ordenar por valor (do maior para o menor)
  aggregated.sort((a, b) => b.value - a.value);

  // 3. Se houver mais de 6 categorias, agrupar as menores em "Outros"
  let finalDataForGraph = aggregated;
  if (aggregated.length > 6) {
    const top5 = aggregated.slice(0, 5);
    const othersSum = aggregated.slice(5).reduce((sum, item) => sum + item.value, 0);
    finalDataForGraph = [...top5, { category_name: 'Outros', value: othersSum }];
  }

  return (
    // O <main> já é fornecido pelo layout.js e estilizado pelo globals.css
    // Adicionamos um wrapper para garantir que todos os elementos da página
    // partilhem o mesmo contexto de largura e alinhamento.
    <div className={styles.contentWrapper}>
      <BalanceCard />
      <DonutGraph data={finalDataForGraph} />
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