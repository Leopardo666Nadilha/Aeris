import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST() {
  const supabase = createRouteHandlerClient({ cookies });
 
  try {
    // 1. Realiza o login anônimo. O Supabase criará um novo usuário
    // com o campo `is_anonymous` como `true`.
    const { data, error } = await supabase.auth.signInAnonymously({
      options: {
        data: {
          full_name: 'Convidado',
        },
      },
    });

    if (error) {
      console.error('Erro ao fazer login anônimo:', error);
      return NextResponse.json({ message: 'Não foi possível criar a sessão de convidado. Tente novamente.' }, { status: 500 });
    }

    // A verificação abaixo garante que a sessão foi realmente criada.
    if (!data.session) {
      console.error('Sessão de convidado não foi retornada após o signInAnonymously.');
      return NextResponse.json({ message: 'Falha ao iniciar a sessão de convidado.' }, { status: 500 });
    }

    // 2. Se tudo correu bem, o cookie de sessão já foi definido.
    return NextResponse.json({ message: 'Sessão de convidado criada com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro inesperado na API de guest-login:', error);
    return NextResponse.json({ message: 'Ocorreu um erro inesperado no servidor.' }, { status: 500 });
  }
}
