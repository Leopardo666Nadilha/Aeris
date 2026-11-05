import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json().catch(() => ({}));

  if (!email || !password) {
    return NextResponse.json({ message: 'Informe e-mail e senha.' }, { status: 400 });
  }
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      {
        message:
          error.code === 'email_not_confirmed'
            ? 'Confirme seu e-mail antes de entrar.'
            : 'E-mail ou senha incorretos.',
      },
      { status: 401 }
    );
  }

  // Os cookies da sessão já foram gravados pelo signInWithPassword
  return NextResponse.json({
    message: 'Login realizado com sucesso!',
    user: { id: data.user.id, email: data.user.email },
  });
}
