'use client';

import styles from './Perfil.module.css';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { CgProfile } from "react-icons/cg";
import { useData } from '../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function PerfilPage() {
  const { transactions, incomes, balance } = useData();
  const { currency, setCurrency, supportedCurrencies, formatCurrency } = useCurrency();

  const totalGasto = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
  const totalMovimentacoes = transactions.length + incomes.length;

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };
  return (
    <main>
      <section className={styles.container}>
        {/* Link para voltar à página inicial */}
        <Link href="/" className={styles.backButton}>
          <IoIosArrowBack size={24} />
          Voltar
        </Link>
        <h1 className={styles.title}>Perfil do Usuário</h1>
        <div className={styles.profileIconContainer}>
          <CgProfile size={100} color="var(--color-primary)" />
        </div>
        <div className={styles.info}>
          <p className={styles.name} id='nome-usuario'>Nome do Usuário</p>
          <p className={styles.email} id='email-usuario'>E-mail do usuário</p>
        </div>
        <div className={styles.banner}>
          <div className={styles.bannerItem}>
            <span className={styles.bannerTitle}>Saldo</span>
            <span className={styles.bannerValue}>{formatCurrency(balance)}</span>
          </div>
          <div className={styles.bannerItem}>
            <span className={styles.bannerTitle}>Total gasto</span>
            <span className={styles.bannerValue}>{formatCurrency(totalGasto)}</span>
          </div>
          <div className={styles.bannerItem}>
            <span className={styles.bannerTitle}>Transações</span>
            <span className={styles.bannerValue}>{totalMovimentacoes}</span>
          </div>
        </div>

        {/* Seletor para alterar a moeda (agora fora do banner) */}
        <div style={{ marginTop: '20px', padding: '1.5rem', backgroundColor: 'var(--color-card-background)', borderRadius: '12px', border: '2px solid var(--color-border)', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
          <label htmlFor="currency-select" style={{ display: 'block', marginBottom: '10px', fontSize: '1rem', fontWeight: '600', color: 'var(--color-text)' }}>
            Moeda de Exibição Padrão:
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={handleCurrencyChange}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: 'var(--color-card-background)',
              border: '2px solid var(--color-border)',
              color: 'var(--color-text)',
              fontSize: '1rem',
              appearance: 'none', // Remove estilo padrão do navegador
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 10px center',
              backgroundSize: '16px',
            }}
          >
            {Object.keys(supportedCurrencies).map((currencyCode) => (
              <option key={currencyCode} value={currencyCode}>
                {currencyCode} ({supportedCurrencies[currencyCode].symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Botões de Ação do Usuário */}
        <div className={styles.actionButtons}>
          <Link href='/dashboard/budget' className={`${styles.actionButton} ${styles.fullWidthButton} cta-button`}>Metas e Categorias</Link>
          <button className={`${styles.actionButton} cta-button`}>Alterar senha</button>
          <button className={`${styles.actionButton} cta-button`}>Sair (logout)</button>
          <button className='destructive-button'>Excluir conta</button>
        </div>
      </section>
    </main>
  );
}