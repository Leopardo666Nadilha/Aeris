import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.json(
      { message: 'Credenciais inválidas.', error: error.message },
      { status: 401 }
    );
  }

  // Esta linha é crucial: ela atualiza a sessão no lado do servidor, garantindo que o middleware a reconheça nas requisições seguintes.
  await supabase.auth.getSession();

  return NextResponse.json({
    message: 'Login realizado com sucesso!',
    user: data.user,
  });
}
