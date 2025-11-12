import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return NextResponse.json({ message: 'Token e nova senha são obrigatórios.' }, { status: 400 });
  }

  try {
    // 1. Criar o hash do token recebido para comparar com o do banco
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SECRET_KEY
    );

    // 2. Encontrar o usuário com base no token hash
    // A busca em JSONB (user_metadata) é mais complexa.
    // Esta é uma limitação do Supabase Auth, o ideal seria uma tabela `password_resets`.
    // A abordagem abaixo é um workaround e pode ser lenta em grande escala.
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw listError;
    }

    // Encontra o usuário que possui o token correspondente E cujo token não expirou
    const user = users.find(u =>
        u.user_metadata?.password_reset_token === hashedToken &&
        new Date(u.user_metadata?.password_reset_expires) > new Date()
    );

    if (!user) {
      return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 400 });
    }

    // Prepara os novos metadados, preservando os existentes
    const newMetadata = { ...user.user_metadata };
    delete newMetadata.password_reset_token;
    delete newMetadata.password_reset_expires;

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
