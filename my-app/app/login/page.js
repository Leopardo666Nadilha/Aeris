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
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

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

      // Salva o e-mail no localStorage para exibição (opcional, mas útil)
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
      setIsLoading(false);
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

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
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
      </div>
    </section>
  );
}
