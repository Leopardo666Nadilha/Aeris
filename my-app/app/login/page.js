'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuUser } from 'react-icons/lu';
import AuthShell from '../../components/AuthShell';
import shellStyles from '../../components/AuthShell.module.css';
import { hardNavigate } from '../../lib/navigation';

// Recarga completa para reinicializar todos os contextos com a nova sessão
const goHome = () => hardNavigate('/');

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null); // 'email' | 'guest' | null

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading('email');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Falha ao fazer login.');
      goHome();
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    setLoading('guest');

    try {
      const res = await fetch('/api/auth/guest-login', { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Falha ao entrar como convidado.');
      }
      goHome();
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <AuthShell
      title="Bem-vindo de volta"
      subtitle="Entre na sua conta para continuar."
      footer={
        <span>
          Ainda não tem conta?{' '}
          <Link href="/register" className="link">
            Cadastre-se
          </Link>
        </span>
      }
    >
      <form onSubmit={handleLogin} className="form">
        <div className="field">
          <label className="field-label" htmlFor="email">
            E-mail
          </label>
          <input
            className="input"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="voce@exemplo.com"
            required
          />
        </div>
        <div className="field">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <label className="field-label" htmlFor="password">
              Senha
            </label>
            <Link href="/forgot-password" className="link" style={{ fontSize: '0.8rem' }}>
              Esqueceu a senha?
            </Link>
          </div>
          <input
            className="input"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={Boolean(loading)}>
          {loading === 'email' ? 'Entrando…' : 'Entrar'}
        </button>
      </form>

      <div className={shellStyles.divider}>ou</div>

      <button
        type="button"
        onClick={handleGuestLogin}
        className="btn btn-secondary btn-block"
        disabled={Boolean(loading)}
      >
        <LuUser aria-hidden="true" />
        {loading === 'guest' ? 'Gerando acesso…' : 'Explorar como convidado'}
      </button>
    </AuthShell>
  );
}
