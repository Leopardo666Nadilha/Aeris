'use client';

import styles from './MonthGoals.module.css';
import { useCurrency } from '@/contexts/CurrencyContext'; // Importa o hook de moeda
import ProgressBar from './ProgressBar';

export default function MonthGoals({ goals }) { // Remove a prop 'transactions'
  const { formatCurrency } = useCurrency(); // Usa o hook para formatação

  return (
    <div className={styles.container}>
      {goals.map((goal) => (
        <div key={goal.id} className={styles.goalItem}>
          <div className={styles.goalInfo}>
            <span className={styles.goalName}>{goal.category_name}</span>
            <span className={styles.goalValues}>
              {/* Usa a função formatCurrency para consistência */}
              {formatCurrency(goal.current)} / {formatCurrency(goal.budget_value)}
            </span>
          </div>
          <ProgressBar current={goal.current} goal={goal.budget_value} />
        </div>
      ))}
    </div>
  );
}