import Link from 'next/link';
import { LuChevronLeft } from 'react-icons/lu';
import styles from './PageHeader.module.css';

export default function PageHeader({ title, subtitle, backHref, backLabel = 'Voltar', actions }) {
  return (
    <div className={styles.wrapper}>
      {backHref && (
        <Link href={backHref} className={styles.back}>
          <LuChevronLeft aria-hidden="true" />
          {backLabel}
        </Link>
      )}
      <div className={styles.row}>
        <div>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </div>
  );
}

export function PageLoader({ label = 'Carregando seus dados…' }) {
  return (
    <div className="page-loader" role="status">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}
