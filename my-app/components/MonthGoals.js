'use client';

import styles from './MonthGoals.module.css';
import ProgressBar from './ProgressBar';

export default function MonthGoals({ goals, transactions }) {
  // Calcula o valor atual gasto em cada meta
  const goalsWithProgress = goals.map(goal => {
    const current = transactions
      .filter(t => t.label === goal.name)
      .reduce((sum, t) => sum + t.value, 0);
    return { ...goal, current };
  });

  return (
    <div className={styles.container}>
      {goalsWithProgress.map((goal) => (
        <div key={goal.name} className={styles.goalItem}>
          <div className={styles.goalInfo}>
            <span className={styles.goalName}>{goal.name}</span>
            <span className={styles.goalValues}>
              R$ {goal.current.toFixed(2)} / R$ {goal.goal.toFixed(2)}
            </span>
          </div>
          <ProgressBar current={goal.current} goal={goal.goal} />
        </div>
      ))}
    </div>
  );
}