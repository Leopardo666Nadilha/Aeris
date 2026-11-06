'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthShell from '../../components/AuthShell';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Algo deu errado.');
      setMessage(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      title="Esqueceu a senha?"
      subtitle="Informe seu e-mail e enviaremos um link para criar uma nova."
      footer={
        <Link href="/login" className="link">
          Voltar para o login
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="form">
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

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}
        {message && <p className="alert alert-success">{message}</p>}

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? 'Enviando…' : 'Enviar link'}
        </button>
      </form>
    </AuthShell>
  );
}
