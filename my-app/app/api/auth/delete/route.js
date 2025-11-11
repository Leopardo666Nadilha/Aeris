import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 1. Obter o usuário da sessão segura
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ message: 'Não autorizado. Faça login novamente.' }, { status: 401 });
    }

    const user = session.user;

    // 2. Verificar a senha do usuário para confirmar a identidade
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({ message: 'A senha fornecida está incorreta.' }, { status: 401 });
    }

    // 3. Criar um cliente admin com a chave de serviço para poder excluir o usuário
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 4. Excluir o usuário usando o ID
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    return NextResponse.json({ message: 'Conta excluída com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor ao tentar excluir a conta.' }, { status: 500 });
  }
}

