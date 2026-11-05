import { createSupabaseAdminClient, findUser } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const { token, password } = await request.json().catch(() => ({}));

  if (!token || !password) {
    return NextResponse.json({ message: 'Token e nova senha são obrigatórios.' }, { status: 400 });
  }

  if (String(password).length < 6) {
    return NextResponse.json({ message: 'A senha deve ter pelo menos 6 caracteres.' }, { status: 400 });
  }

  try {
    // 1. Criar o hash do token recebido para comparar com o do banco
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const supabaseAdmin = createSupabaseAdminClient();

    // 2. Encontrar o usuário com base no token hash
    // A busca em JSONB (user_metadata) é mais complexa.
    // Esta é uma limitação do Supabase Auth, o ideal seria uma tabela `password_resets`.
    // A abordagem abaixo é um workaround e pode ser lenta em grande escala.
    // Encontra o usuário que possui o token correspondente E cujo token não expirou
    const user = await findUser(
      supabaseAdmin,
      (u) =>
        u.user_metadata?.password_reset_token === hashedToken &&
        new Date(u.user_metadata?.password_reset_expires) > new Date()
    );

    if (!user) {
      return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 400 });
    }

    // Invalida o token. O Auth mescla user_metadata, então apagar a chave não basta:
    // é preciso sobrescrevê-la com null para que o link não possa ser reutilizado.
    const newMetadata = { ...user.user_metadata, password_reset_token: null, password_reset_expires: null };

    // 3. Atualizar a senha do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        password: password,
        // Limpa apenas os metadados de redefinição, preservando o resto
        user_metadata: newMetadata,
      }
    );

    if (updateError) {
      throw updateError;
    }

    return NextResponse.json({ message: 'Senha redefinida com sucesso!' }, { status: 200 });

  } catch (error) {
    console.error('Erro na API de reset-password:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor ao tentar redefinir a senha.' }, { status: 500 });
  }
}
