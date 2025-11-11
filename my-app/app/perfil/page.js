'use client';

import { useState, useEffect, useMemo } from 'react';
import styles from './Perfil.module.css';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import { CgProfile } from 'react-icons/cg';
import { useData } from '../../lib/DataContext';
import { useRouter } from 'next/navigation';
import { useCurrency } from '@/contexts/CurrencyContext'; // Importa o hook de moeda
import Modal from '../../components/Modal'; // Componente Modal
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function PerfilPage() {
  const { transactions, incomes, balance } = useData();
  const { currency, setCurrency, supportedCurrencies, formatCurrency } = useCurrency();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // Estado para o modal de logout
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Estado para o modal de exclusão
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordForDelete1, setPasswordForDelete1] = useState(''); // Senha 1 para exclusão
  const [passwordForDelete2, setPasswordForDelete2] = useState(''); // Senha 2 para exclusão
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const router = useRouter();
  const supabase = createClientComponentClient();

  // Calcula os totais usando useMemo para eficiência
  const totalGasto = useMemo(() => transactions.reduce((sum, transaction) => sum + transaction.value, 0), [transactions]);
  const totalMovimentacoes = useMemo(() => transactions.length + incomes.length, [transactions, incomes]);

  const handleCurrencyChange = (event) => {
    setCurrency(event.target.value);
  };

  // Busca os dados do usuário apenas uma vez
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        // O middleware já deve ter redirecionado, mas isso é uma segurança extra.
        router.push('/login');
        return;
      }

      // O nome completo é salvo em 'user_metadata' durante o registro
      setUserName(user.user_metadata?.full_name || 'Usuário');
      setUserEmail(user.email);
    };

    fetchUser();
    // A dependência do supabase garante que, se o cliente mudar, a função roda de novo.
  }, [supabase, router]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('As novas senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword }), // Não enviamos mais o e-mail!
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha ao alterar a senha.');
      }

      setSuccess(data.message);
      setTimeout(() => setIsModalOpen(false), 2000); // Fecha o modal após 2s
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (!res.ok) {
        throw new Error('Falha ao tentar sair.');
      }
      // Após o logout bem-sucedido, redireciona para a página de login
      router.push('/login');
    } catch (err) {
      setError(err.message); // Mostra um erro se o logout falhar
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setError('');

    if (passwordForDelete1 !== passwordForDelete2) {
      setError('As senhas digitadas não coincidem.');
      return;
    }

    if (!passwordForDelete1) {
      setError('Por favor, digite sua senha.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForDelete1 }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha ao excluir a conta.');
      }

      alert('Sua conta foi excluída com sucesso.');
      router.push('/login'); // Redireciona para o login após a exclusão
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <section className={styles.container}>
        {/* Botão de voltar */}
        <Link href="/" className={styles.backButton}>
          <IoIosArrowBack size={24} />
          Voltar
        </Link>

        <h1 className={styles.title}>Perfil do Usuário</h1>

        <div className={styles.profileIconContainer}>
          <CgProfile size={100} color="var(--color-primary)" />
        </div>

        <div className={styles.info}>
          <p className={styles.name} id="nome-usuario">{userName}</p>
          <p className={styles.email} id="email-usuario">{userEmail}</p>
        </div>

        {/* Banner de informações */}
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

        {/* Seletor de moeda */}
        <div
          style={{
            marginTop: '20px',
            padding: '1.5rem',
            backgroundColor: 'var(--color-card-background)',
            borderRadius: '12px',
            border: '2px solid var(--color-border)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }}
        >
          <label
            htmlFor="currency-select"
            style={{
              display: 'block',
              marginBottom: '10px',
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--color-text)',
            }}
          >
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
              appearance: 'none',
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

        {/* Botões de Ação */}
        <div className={styles.actionButtons}>
          <Link href="/dashboard/budget" className={`${styles.actionButton} ${styles.fullWidthButton} cta-button`}>
            Metas e Categorias
          </Link>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`${styles.actionButton} cta-button`}
          >
            Alterar senha
          </button>

          <button
            onClick={() => setIsLogoutModalOpen(true)} // Abre o modal de confirmação de logout
            className={`${styles.actionButton} cta-button`}
          >
            Sair (logout)
          </button>

          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="destructive-button">
            Excluir conta
          </button>
        </div>
      </section>

      {/* Modal de Alterar Senha */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alterar Senha"
      >
        <form onSubmit={handlePasswordChange} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="oldPassword">Senha Atual</label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword">Nova Senha</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirmar Nova Senha</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <button
            type="submit"
            className="cta-button"
            disabled={isLoading}
            style={{ width: '100%', marginTop: '1rem' }}
          >
            {isLoading ? 'Alterando...' : 'Salvar Nova Senha'}
          </button>
        </form>
      </Modal>

      {/* Modal de Confirmação de Logout */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirmar Saída"
      >
        <div className={styles.modalContent}>
          <p>Você tem certeza que deseja sair da sua conta?</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.modalActions}>
            <button onClick={() => setIsLogoutModalOpen(false)} className="secondary-button">
              Cancelar
            </button>
            <button onClick={handleLogout} className="cta-button" disabled={isLoading}>
              {isLoading ? 'Saindo...' : 'Confirmar Saída'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Modal de Confirmação de Exclusão de Conta */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Excluir Conta Permanentemente"
      >
        <form onSubmit={handleDeleteAccount} className={styles.modalForm}>
          <p className={styles.warningText}>
            <strong>Atenção:</strong> Esta ação é irreversível. Todos os seus dados, incluindo transações e saldos, serão apagados para sempre.
          </p>
          <p className={styles.warningText}>
            Para confirmar, por favor, digite sua senha nos dois campos abaixo.
          </p>
          <div className={styles.formGroup}>
            <label htmlFor="delete-password-1">Senha</label>
            <input
              type="password"
              id="delete-password-1"
              value={passwordForDelete1}
              onChange={(e) => setPasswordForDelete1(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="delete-password-2">Confirmar Senha</label>
            <input
              type="password"
              id="delete-password-2"
              value={passwordForDelete2}
              onChange={(e) => setPasswordForDelete2(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className="destructive-button" disabled={isLoading || passwordForDelete1 !== passwordForDelete2 || !passwordForDelete1} style={{ width: '100%', marginTop: '1rem' }}>
            {isLoading ? 'Excluindo...' : 'Eu entendo, excluir minha conta'}
          </button>
        </form>
      </Modal>
    </main>
  );
}
