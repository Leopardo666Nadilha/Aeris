import styles from './ProgressBar.module.css';

export default function ProgressBar({ current, goal }) {
  // Calcula a porcentagem do progresso, permitindo ultrapassar 100%
  const percentage = goal > 0 ? (current / goal) * 100 : 0;

  // Define a largura da barra, limitada a 100% para não quebrar o layout visual
  const barWidth = Math.min(percentage, 100);

  // Define a classe da barra de preenchimento com base no progresso
  const fillClassName = percentage > 100 ? `${styles.progressBarFill} ${styles.exceeded}` : styles.progressBarFill;

  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressBarBackground}>
        <div
          className={fillClassName}
          style={{ width: `${barWidth}%` }}
        ></div>
      </div>
      <span className={styles.progressText}>
        {percentage.toFixed(0)}%
      </span>
    </div>
  );
}