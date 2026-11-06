'use client';

import Link from 'next/link';
import { LuChevronRight, LuTarget } from 'react-icons/lu';
import { useData } from '../lib/DataContext';
import { budgetsWithProgress } from '../lib/finance';
import BudgetRow from './BudgetRow';

/** Prévia dos três orçamentos mais próximos do limite no mês atual. */
export default function Budgets() {
  const { transactions, budgets } = useData();

  const goals = budgetsWithProgress(
    budgets.filter((b) => b.budget_value > 0),
    transactions
  )
    .sort((a, b) => b.progress - a.progress || b.budget_value - a.budget_value)
    .slice(0, 3);

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">Orçamentos do mês</h2>
        {goals.length > 0 && (
          <Link href="/dashboard" className="card-link">
            Ver tudo <LuChevronRight aria-hidden="true" />
          </Link>
        )}
      </div>
      {goals.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {goals.map((goal) => (
            <BudgetRow key={goal.id} budget={goal} />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <LuTarget />
          </span>
          <h3>Planeje seus gastos</h3>
          <p>
            {budgets.length > 0
              ? 'Defina uma meta mensal para suas categorias e acompanhe o progresso aqui.'
              : 'Crie orçamentos por categoria e acompanhe o progresso aqui.'}
          </p>
          <Link href="/dashboard/budget" className="btn btn-secondary btn-sm">
            {budgets.length > 0 ? 'Definir metas' : 'Criar orçamento'}
          </Link>
        </div>
      )}
    </section>
  );
}
