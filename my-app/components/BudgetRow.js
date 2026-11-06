'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import ProgressBar from './ProgressBar';
import styles from './BudgetRow.module.css';

/** Linha de orçamento com valores, status e barra de progresso. */
export default function BudgetRow({ budget, actions }) {
  const { formatCurrency } = useCurrency();
  const remaining = budget.budget_value - budget.current;
  const hasGoal = budget.budget_value > 0;
  const percentage = hasGoal ? Math.round((budget.current / budget.budget_value) * 100) : 0;

  if (!hasGoal) {
    return (
      <div className={styles.row}>
        <div className={styles.top}>
          <span className={styles.name}>{budget.category_name}</span>
          <div className={styles.right}>{actions}</div>
        </div>
        <div className={styles.bottom}>
          <span className="tabular">{formatCurrency(budget.current)} gastos este mês</span>
          <span className={styles.of}>Sem meta definida</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.row}>
      <div className={styles.top}>
        <span className={styles.name}>{budget.category_name}</span>
        <div className={styles.right}>
          <span className={`${styles.percent} ${percentage > 100 ? styles.over : ''}`}>{percentage}%</span>
          {actions}
        </div>
      </div>
      <ProgressBar current={budget.current} goal={budget.budget_value} label={`Orçamento de ${budget.category_name}`} />
      <div className={styles.bottom}>
        <span className="tabular">
          {formatCurrency(budget.current)} <span className={styles.of}>de {formatCurrency(budget.budget_value)}</span>
        </span>
        <span className={`tabular ${remaining < 0 ? styles.over : ''}`}>
          {remaining >= 0 ? `Resta ${formatCurrency(remaining)}` : `${formatCurrency(-remaining)} acima`}
        </span>
      </div>
    </div>
  );
}
