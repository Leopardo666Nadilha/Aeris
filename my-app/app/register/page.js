'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LuMail } from 'react-icons/lu';
import AuthShell from '../../components/AuthShell';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    if (password.length < 6) return setError('A senha deve ter pelo menos 6 caracteres.');
    if (password !== form.get('confirmPassword')) return setError('As senhas não coincidem.');

    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      if (signUpError) throw signUpError;
      setRegisteredEmail(email);
    } catch (err) {
      setError(err.message || 'Não foi possível concluir o cadastro.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredEmail) {
    return (
      <AuthShell
        title="Confira seu e-mail"
        footer={
          <Link href="/login" className="btn btn-primary btn-block">
            Ir para o login
          </Link>
        }
      >
        <div className="alert alert-success" style={{ display: 'flex', gap: '0.6rem' }}>
          <LuMail aria-hidden="true" style={{ flexShrink: 0, marginTop: 2 }} />
          <span>
            Enviamos um link de confirmação para <strong>{registeredEmail}</strong>. Confirme o cadastro e depois faça
            login.
          </span>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Crie sua conta"
      subtitle="Leva menos de um minuto."
      footer={
        <span>
          Já tem uma conta?{' '}
          <Link href="/login" className="link">
            Entrar
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSubmit} className="form">
        <div className="field">
          <label className="field-label" htmlFor="name">
            Nome
          </label>
          <input className="input" type="text" id="name" name="name" autoComplete="name" placeholder="Seu nome" required />
        </div>
        <div className="field">
          <label className="field-label" htmlFor="email">
            E-mail
          </label>
          <input
            className="input"
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            required
          />
        </div>
        <div className="form-row">
          <div className="field">
            <label className="field-label" htmlFor="password">
              Senha
            </label>
            <input
              className="input"
              type="password"
              id="password"
              name="password"
              autoComplete="new-password"
              minLength={6}
              required
            />
          </div>
          <div className="field">
            <label className="field-label" htmlFor="confirmPassword">
              Confirmar
            </label>
            <input
              className="input"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
            />
          </div>
        </div>
        <span className="field-hint" style={{ marginTop: '-0.5rem' }}>
          Mínimo de 6 caracteres.
        </span>

        {error && (
          <p className="alert alert-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Criando conta…' : 'Criar conta'}
        </button>
      </form>
    </AuthShell>
  );
}
