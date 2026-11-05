import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { password } = await request.json();
    const supabase = await createSupabaseServerClient();

    // 1. Obter o usuário da sessão segura
    // getUser() valida o token no servidor do Supabase; getSession() apenas lê o cookie.
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ message: 'Não autorizado. Faça login novamente.' }, { status: 401 });
    }

    // 2. Verificar a senha do usuário para confirmar a identidade
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: password,
    });

    if (signInError) {
      return NextResponse.json({ message: 'A senha fornecida está incorreta.' }, { status: 401 });
    }

    // 3. Criar um cliente admin com a chave de serviço para poder excluir o usuário
    const supabaseAdmin = createSupabaseAdminClient();

    // 4. Excluir o usuário usando o ID
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      throw deleteError;
    }

    // Encerra a sessão local (limpa os cookies) do usuário excluído
    await supabase.auth.signOut();

    return NextResponse.json({ message: 'Conta excluída com sucesso.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir conta:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor ao tentar excluir a conta.' }, { status: 500 });
  }
}

