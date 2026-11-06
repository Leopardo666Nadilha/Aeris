'use client';

import Link from 'next/link';
import { LuPencil, LuTarget } from 'react-icons/lu';
import PageHeader, { PageLoader } from '../../components/PageHeader';
import BudgetRow from '../../components/BudgetRow';
import ProgressBar from '../../components/ProgressBar';
import { useData } from '../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { budgetsWithProgress, currentMonthKey, formatMonthLabel } from '../../lib/finance';
import styles from './Dashboard.module.css';

export default function DashboardPage() {
  const { budgets, transactions, loading } = useData();
  const { formatCurrency } = useCurrency();

  if (loading) return <PageLoader />;

  const items = budgetsWithProgress(budgets, transactions).sort((a, b) => b.progress - a.progress);
  const totalBudget = items.reduce((sum, b) => sum + b.budget_value, 0);
  const totalSpent = items.reduce((sum, b) => sum + b.current, 0);
  const overCount = items.filter((b) => b.progress > 1).length;
  const remaining = totalBudget - totalSpent;

  return (
    <div className="fade-up">
      <PageHeader
        title="Metas e orçamentos"
        subtitle={`Acompanhamento de ${formatMonthLabel(currentMonthKey()).toLowerCase()}`}
        actions={
          budgets.length > 0 && (
            <Link href="/dashboard/budget" className="btn btn-secondary btn-sm">
              <LuPencil aria-hidden="true" /> Gerenciar
            </Link>
          )
        }
      />

      {budgets.length === 0 ? (
        <section className="card">
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              <LuTarget />
            </span>
            <h3>Nenhum orçamento criado</h3>
            <p>Defina quanto quer gastar por categoria a cada mês e acompanhe seu progresso.</p>
            <Link href="/dashboard/budget" className="btn btn-primary">
              Começar a planejar
            </Link>
          </div>
        </section>
      ) : (
        <div className={styles.layout}>
          <section className={`card ${styles.summary}`}>
            <span className="eyebrow">Orçamento total do mês</span>
            <p className={styles.summaryValue}>
              {formatCurrency(totalSpent)}
              <span> de {formatCurrency(totalBudget)}</span>
            </p>
            <ProgressBar current={totalSpent} goal={totalBudget} label="Orçamento total" />
            <dl className={styles.stats}>
              <div>
                <dt>{remaining >= 0 ? 'Disponível' : 'Acima do total'}</dt>
                <dd className={remaining < 0 ? styles.negative : ''}>{formatCurrency(Math.abs(remaining))}</dd>
              </div>
              <div>
                <dt>Categorias</dt>
                <dd>{items.length}</dd>
              </div>
              <div>
                <dt>Estouradas</dt>
                <dd className={overCount > 0 ? styles.negative : ''}>{overCount}</dd>
              </div>
            </dl>
          </section>

          <section className="card">
            <div className="card-header">
              <h2 className="card-title">Por categoria</h2>
            </div>
            <div className={styles.list}>
              {items.map((budget) => (
                <BudgetRow key={budget.id} budget={budget} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
