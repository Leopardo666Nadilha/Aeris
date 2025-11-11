'use client';

import styles from './MonthGoals.module.css';
import { useCurrency } from '@/contexts/CurrencyContext'; // Importa o hook de moeda
import ProgressBar from './ProgressBar';

export default function MonthGoals({ goals }) { // Remove a prop 'transactions'
  const { formatCurrency } = useCurrency(); // Usa o hook para formatação

  return (
    <div className={styles.container}>
      {goals.map((goal) => (
        <div key={goal.name} className={styles.goalItem}>
          <div className={styles.goalInfo}>
            <span className={styles.goalName}>{goal.name}</span>
            <span className={styles.goalValues}>
              {/* Usa a função formatCurrency para consistência */}
              {formatCurrency(goal.current)} / {formatCurrency(goal.goal)}
            </span>
          </div>
          <ProgressBar current={goal.current} goal={goal.goal} />
        </div>
      ))}
    </div>
  );
}