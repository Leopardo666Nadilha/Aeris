import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request) {
  try {
    const { oldPassword, newPassword } = await request.json();
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 1. Obter o usuário da sessão segura
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ message: 'Não autorizado. Faça login novamente.' }, { status: 401 });
    }

    const user = session.user;

    // --- Validação dos Dados ---
    if (!oldPassword || !newPassword) {
      return NextResponse.json({ message: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
    }

    // 2. Verificar a senha antiga (re-autenticando)
    // O Supabase não expõe o hash da senha, então a maneira correta é tentar fazer login novamente.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: oldPassword,
    });

    if (signInError) {
      return NextResponse.json({ message: 'A senha atual está incorreta.' }, { status: 401 });
    }

    // 3. Atualizar a senha do usuário autenticado
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) throw updateError;

    return NextResponse.json({ message: 'Senha alterada com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
