'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  // O token vem direto da URL; não precisa ser copiado para um estado.
  const token = searchParams.get('token') ?? '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [submitError, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const error = submitError || (token ? '' : 'Link de redefinição inválido ou incompleto. Solicite um novo.');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (password !== confirmPassword) return setError('As senhas não coincidem.');

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Falha ao redefinir a senha.');

      setMessage(`${data.message} Redirecionando para o login…`);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <div className="field">
        <label className="field-label" htmlFor="password">
          Nova senha
        </label>
        <input
          className="input"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          minLength={6}
          required
          disabled={!token || Boolean(message)}
        />
      </div>
      <div className="field">
        <label className="field-label" htmlFor="confirmPassword">
          Confirme a nova senha
        </label>
        <input
          className="input"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          required
          disabled={!token || Boolean(message)}
        />
      </div>

      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}
      {message && <p className="alert alert-success">{message}</p>}

      {token ? (
        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading || Boolean(message)}>
          {isLoading ? 'Redefinindo…' : 'Redefinir senha'}
        </button>
      ) : (
        <Link href="/forgot-password" className="btn btn-primary btn-block">
          Solicitar novo link
        </Link>
      )}
    </form>
  );
}
