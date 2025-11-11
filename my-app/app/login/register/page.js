'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Register.module.css';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Lógica de registro aqui
    console.log('Name:', name, 'Email:', email, 'Password:', password);
    // Redireciona para o dashboard após o registro (simulação)
    router.push('/dashboard');
  };

  return (
    <div className={styles.container}>
      <div className={styles.registerBox}>
        <h1 className={styles.title}>Cadastro</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Nome
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className={styles.input}
              placeholder="Seu nome completo"
            />
          </div>
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
              placeholder="Crie uma senha"
            />
          </div>
          <button type="submit" className="cta-button">
            Cadastrar
          </button>
        </form>
        <p className={styles.loginText}>
          Já tem uma conta?{' '}
          <Link href="/login" className={styles.loginLink}>
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
