'use client';

import Link from 'next/link';
import styles from './Dashboard.module.css';
import { useData } from '../../lib/DataContext';
import ProgressBar from '../../components/ProgressBar';
import { useCurrency } from '@/contexts/CurrencyContext'; // Importa o hook de moeda
import { IoIosArrowBack } from 'react-icons/io';

export default function DashboardPage() {
  const { categories, transactions } = useData();
  const { formatCurrency } = useCurrency(); // Obtém a função de formatação

  // Calcula o progresso para exibir no dashboard
  const categoriesWithProgress = categories.map(category => {
    const current = transactions
      .filter(t => t.category_name === category.name)
      .reduce((sum, t) => sum + t.value, 0);
    return { ...category, current };
  });

  return (
    <div className={styles.container}>
      {/* Link para voltar à página inicial */}
      <Link href="/" className={styles.backButton}>
        <IoIosArrowBack size={24} />
        Voltar
      </Link>
      <h1 className={styles.title}>Dashboard de Metas e Orçamentos</h1>

      {categories.length === 0 ? (
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
            {categoriesWithProgress.map((category) => (
              <div key={category.name} className={styles.summaryItem}>
                <div className={styles.summaryInfo}>
                  <span className={styles.summaryCategoryName}>{category.name}</span>
                  <span className={styles.summaryValues}>{formatCurrency(category.current)} / {formatCurrency(category.goal)}</span>
                </div>
                <ProgressBar current={category.current} goal={category.goal} />
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
