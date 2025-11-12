'use client';

import Link from 'next/link';
import styles from './Dashboard.module.css';
import { useData } from '../../lib/DataContext';
import ProgressBar from '../../components/ProgressBar';
import { useCurrency } from '@/contexts/CurrencyContext'; // Importa o hook de moeda
import { IoIosArrowBack } from 'react-icons/io';

export default function DashboardPage() {
  const { budgets, transactions } = useData();
  const { formatCurrency } = useCurrency(); // Obtém a função de formatação

  // Calcula o progresso para exibir no dashboard
  const budgetsWithProgress = budgets.map(budget => {
    const current = transactions
      .filter(t => t.category_name === budget.category_name)
      .reduce((sum, t) => sum + t.value, 0);
    return { ...budget, current };
  });

  return (
    <div className={styles.container}>
      {/* Link para voltar à página inicial */}
      <Link href="/" className={styles.backButton}>
        <IoIosArrowBack size={24} />
        Voltar
      </Link>
      <h1 className={styles.title}>Dashboard de Metas e Orçamentos</h1>

      {budgets.length === 0 ? (
        <>
          <p className={styles.description}>
            Bem-vindo ao seu painel de controle financeiro. Crie orçamentos,
            defina metas e acompanhe seu progresso.
          </p>
          <Link href='/dashboard/budget' className='cta-button'>
            Comece a planejar
          </Link>
        </>
      ) : (
        <>
          <section className={styles.summarySection}>
            <h2>Resumo do seu Orçamento</h2>
            {budgetsWithProgress.map((budget) => (
              <div key={budget.id} className={styles.summaryItem}>
                <div className={styles.summaryInfo}>
                  <span className={styles.summaryCategoryName}>{budget.category_name}</span>
                  <span className={styles.summaryValues}>{formatCurrency(budget.current)} / {formatCurrency(budget.budget_value)}</span>
                </div>
                <ProgressBar current={budget.current} goal={budget.budget_value} />
              </div>
            ))}
          </section>
          <Link href='/dashboard/budget' className={`${styles.dashboardButton} cta-button`}>
            Editar Orçamento
          </Link>
        </>
      )}
    </div>
  );
}
