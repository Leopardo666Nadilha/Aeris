'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './Login.module.css'; // Usaremos um CSS novo para o login

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState({ email: false, guest: false });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading({ email: true, guest: false });

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Falha ao fazer login.');
      }

      // Salva o e-mail no localStorage para exibição
      // A segurança real vem do cookie de sessão, não disso.
      localStorage.setItem('userEmail', data.user.email);

      // Força um recarregamento completo da página para a rota raiz.
      // Isso garante que todos os contextos (como o DataContext) sejam
      // reinicializados do zero com a nova sessão do usuário,
      // resolvendo o problema de dados zerados e a longa espera.
      window.location.href = '/';

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ email: false, guest: false });
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading({ email: false, guest: true });

    try {
      const res = await fetch('/api/auth/guest-login', {
        method: 'POST',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Falha ao entrar como convidado.');
      }

      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading({ email: false, guest: false });
    }
  };

  return (
    <section className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Bem-vindo ao Aeris Finanças!</h1>
        <p className={styles.subtitle}>Acesse sua conta para continuar.</p>
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitButton} disabled={loading.email || loading.guest}>
            {loading.email ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className={styles.registerPrompt}>
          <span>Não tem uma conta? </span>
          <Link href="/register" className={styles.link}>
            Cadastre-se
          </Link>
        </div>
        <div className={styles.forgotPasswordLink}>
          <span>Esqueceu sua senha? </span>
          <Link href="/forgot-password" className={styles.link}>
            Clique aqui
          </Link>
        </div>
        <div className={styles.forgotPasswordLink}>
          <button onClick={handleGuestLogin} className={styles.linkButton} disabled={loading.email || loading.guest}>
            {loading.guest ? 'Gerando acesso...' : 'Acessar como Convidado'}
          </button>
        </div>
      </div>
    </section>
  );
}
