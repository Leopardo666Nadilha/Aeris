'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LuChevronRight, LuKeyRound, LuLogOut, LuTarget, LuTrash2, LuUserX } from 'react-icons/lu';
import PageHeader, { PageLoader } from '../../components/PageHeader';
import Modal from '../../components/Modal';
import ThemeToggleButton from '../../lib/ThemeToggleButton';
import { useData } from '../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { sumValues } from '../../lib/finance';
import { hardNavigate } from '../../lib/navigation';
import styles from './Perfil.module.css';

const postJson = async (url, body) => {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Algo deu errado. Tente novamente.');
  return data;
};

// Recarga completa: zera todos os contextos depois de sair/excluir a conta
const goToLogin = () => hardNavigate('/login');

export default function PerfilPage() {
  const { transactions, incomes, balance, user, isGuest, loading } = useData();
  const { currency, setCurrency, supportedCurrencies, formatCurrency } = useCurrency();

  const [modal, setModal] = useState(null); // 'password' | 'logout' | 'delete' | null
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalGasto = useMemo(() => sumValues(transactions), [transactions]);
  const totalMovimentacoes = transactions.length + incomes.length;

  if (loading) return <PageLoader />;

  const userName = user?.user_metadata?.full_name || (isGuest ? 'Convidado' : 'Usuário');
  const initials = userName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const openModal = (name) => {
    setError('');
    setSuccess('');
    setModal(name);
  };
  const closeModal = () => setModal(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const form = new FormData(e.currentTarget);
    const oldPassword = form.get('oldPassword');
    const newPassword = form.get('newPassword');
    if (newPassword !== form.get('confirmPassword')) return setError('As novas senhas não coincidem.');
    if (String(newPassword).length < 6) return setError('A nova senha deve ter pelo menos 6 caracteres.');

    setIsLoading(true);
    try {
      const data = await postJson('/api/auth/change-password', { oldPassword, newPassword });
      setSuccess(data.message);
      setTimeout(closeModal, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    setError('');
    try {
      await postJson('/api/auth/logout');
      goToLogin();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // O cadastro só é acessível sem sessão (o proxy redireciona usuários logados)
  const handleGoToRegister = async () => {
    try {
      await postJson('/api/auth/logout');
    } finally {
      hardNavigate('/register');
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const password = form.get('password');
    if (!password) return setError('Digite sua senha para confirmar.');
    if (password !== form.get('confirm')) return setError('As senhas digitadas não coincidem.');

    setIsLoading(true);
    try {
      await postJson('/api/auth/delete', { password });
      goToLogin();
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-up">
      <PageHeader title="Perfil" />

      <div className={styles.layout}>
        <div className={styles.column}>
          <section className={`card ${styles.identity}`}>
            <div className={styles.avatar} aria-hidden="true">
              {initials || '?'}
            </div>
            <div className={styles.identityText}>
              <p className={styles.name}>
                {userName}
                {isGuest && <span className={styles.badge}>Convidado</span>}
              </p>
              <p className={styles.email}>{user?.email || 'Acesso temporário sem e-mail'}</p>
            </div>
          </section>

          <section className={`card ${styles.stats}`}>
            <div>
              <span>Saldo</span>
              <strong className={balance < 0 ? styles.negative : ''}>{formatCurrency(balance)}</strong>
            </div>
            <div>
              <span>Total gasto</span>
              <strong>{formatCurrency(totalGasto)}</strong>
            </div>
            <div>
              <span>Movimentações</span>
              <strong>{totalMovimentacoes}</strong>
            </div>
          </section>

          {isGuest && (
            <p className="alert alert-warning">
              Você está usando uma conta de convidado. Os dados de convidados são apagados automaticamente todos os
              dias.{' '}
              <button type="button" className={`link ${styles.inlineLink}`} onClick={handleGoToRegister}>
                Crie uma conta
              </button>{' '}
              para guardar suas finanças.
            </p>
          )}
        </div>

        <div className={styles.column}>
          <section className="card">
            <h2 className={styles.sectionTitle}>Preferências</h2>
            <div className={styles.settingRow}>
              <label htmlFor="currency-select">
                <span className={styles.settingLabel}>Moeda de exibição</span>
                <span className={styles.settingHint}>Apenas formata os valores, sem conversão.</span>
              </label>
              <select
                id="currency-select"
                className={`input ${styles.settingSelect}`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {Object.entries(supportedCurrencies).map(([code, { symbol }]) => (
                  <option key={code} value={code}>
                    {code} ({symbol})
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.settingRow}>
              <div>
                <span className={styles.settingLabel}>Tema</span>
                <span className={styles.settingHint}>Alterna entre claro e escuro.</span>
              </div>
              <ThemeToggleButton className={`icon-btn ${styles.themeButton}`} />
            </div>
          </section>

          <section className="card">
            <h2 className={styles.sectionTitle}>Conta</h2>
            <nav className={styles.menu}>
              <Link href="/dashboard/budget" className={styles.menuItem}>
                <LuTarget aria-hidden="true" />
                <span>Metas e categorias</span>
                <LuChevronRight aria-hidden="true" className={styles.chevron} />
              </Link>
              {!isGuest && (
                <button type="button" className={styles.menuItem} onClick={() => openModal('password')}>
                  <LuKeyRound aria-hidden="true" />
                  <span>Alterar senha</span>
                  <LuChevronRight aria-hidden="true" className={styles.chevron} />
                </button>
              )}
              <button type="button" className={styles.menuItem} onClick={() => openModal('logout')}>
                <LuLogOut aria-hidden="true" />
                <span>Sair</span>
                <LuChevronRight aria-hidden="true" className={styles.chevron} />
              </button>
              {!isGuest && (
                <button
                  type="button"
                  className={`${styles.menuItem} ${styles.danger}`}
                  onClick={() => openModal('delete')}
                >
                  <LuTrash2 aria-hidden="true" />
                  <span>Excluir conta</span>
                  <LuChevronRight aria-hidden="true" className={styles.chevron} />
                </button>
              )}
            </nav>
          </section>
        </div>
      </div>

      <Modal isOpen={modal === 'password'} onClose={closeModal} title="Alterar senha">
        <form onSubmit={handlePasswordChange} className="form">
          <div className="field">
            <label className="field-label" htmlFor="oldPassword">
              Senha atual
            </label>
            <input className="input" type="password" id="oldPassword" name="oldPassword" autoComplete="current-password" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="newPassword">
              Nova senha
            </label>
            <input className="input" type="password" id="newPassword" name="newPassword" autoComplete="new-password" minLength={6} required />
            <span className="field-hint">Mínimo de 6 caracteres.</span>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              Confirmar nova senha
            </label>
            <input className="input" type="password" id="confirmPassword" name="confirmPassword" autoComplete="new-password" required />
          </div>
          {error && <p className="alert alert-error">{error}</p>}
          {success && <p className="alert alert-success">{success}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Salvando…' : 'Salvar nova senha'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={modal === 'logout'}
        onClose={closeModal}
        title="Sair da conta?"
        description={isGuest ? 'Como convidado, você não poderá voltar a esta sessão depois de sair.' : 'Você poderá entrar novamente a qualquer momento.'}
        size="sm"
      >
        {error && <p className="alert alert-error">{error}</p>}
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleLogout} disabled={isLoading}>
            {isLoading ? 'Saindo…' : 'Sair'}
          </button>
        </div>
      </Modal>

      <Modal isOpen={modal === 'delete'} onClose={closeModal} title="Excluir conta permanentemente">
        <form onSubmit={handleDeleteAccount} className="form">
          <div className="alert alert-error" style={{ display: 'flex', gap: '0.6rem' }}>
            <LuUserX aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
            <span>
              Esta ação é irreversível. Todos os seus dados — transações, rendas e orçamentos — serão apagados.
            </span>
          </div>
          <div className="field">
            <label className="field-label" htmlFor="delete-password">
              Senha
            </label>
            <input className="input" type="password" id="delete-password" name="password" autoComplete="current-password" required />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="delete-confirm">
              Confirmar senha
            </label>
            <input className="input" type="password" id="delete-confirm" name="confirm" autoComplete="current-password" required />
          </div>
          {error && <p className="alert alert-error">{error}</p>}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-danger" disabled={isLoading}>
              {isLoading ? 'Excluindo…' : 'Excluir minha conta'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
