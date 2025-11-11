'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({

        email: email,
        password: password,
      });

      if (signInError) throw signInError;

      router.push('/dashboard'); // Redireciona para o dashboard após o login
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Login</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder="seuemail@exemplo.com"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className={styles.input}
              placeholder="Sua senha"
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" className="cta-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className={styles.signupText}>
          Não tem uma conta?{' '}
          <Link href="/register" className={styles.signupLink}>
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
