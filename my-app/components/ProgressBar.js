import styles from './ProgressBar.module.css';

/** Barra de progresso do orçamento: muda de cor perto (≥ 85%) e acima do limite. */
export default function ProgressBar({ current, goal, label }) {
  const percentage = goal > 0 ? (current / goal) * 100 : 0;
  const width = Math.min(percentage, 100);
  const status = percentage > 100 ? styles.over : percentage >= 85 ? styles.near : '';

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(Math.min(percentage, 100))}
      aria-label={label}
    >
      <div className={`${styles.fill} ${status}`} style={{ width: `${width}%` }} />
    </div>
  );
}
