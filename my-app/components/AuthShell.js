import styles from './AuthShell.module.css';

/** Moldura das telas de autenticação: painel de marca (desktop) + formulário. */
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.brand} aria-hidden="true">
        <div className={styles.brandGlow} />
        <p className={styles.brandQuote}>
          Clareza sobre o seu dinheiro, <em>todo mês.</em>
        </p>
        <ul className={styles.brandList}>
          <li>Registre gastos e recebimentos em segundos</li>
          <li>Acompanhe orçamentos por categoria</li>
          <li>Veja para onde vai cada real</li>
        </ul>
      </aside>

      <section className={styles.panel}>
        <div className={`${styles.content} fade-up`}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
          {footer && <div className={styles.footer}>{footer}</div>}
        </div>
      </section>
    </div>
  );
}
