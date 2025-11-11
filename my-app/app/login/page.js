'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Login.module.css';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = e => {
    e.preventDefault();
    // Lógica de autenticação aqui
    console.log('Email:', email, 'Password:', password);
    // Redireciona para o dashboard após o login (simulação)
    router.push('/dashboard');
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
          <button type="submit" className="cta-button">
            Entrar
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
