import { createSupabaseAdminClient, findUser } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Rota para solicitar a redefinição de senha
export async function POST(request) {
  const { email: rawEmail } = await request.json().catch(() => ({}));
  const email = String(rawEmail || '').trim().toLowerCase();

  if (!email) {
    return NextResponse.json({ message: 'E-mail é obrigatório.' }, { status: 400 });
  }

  try {
    // Usamos o cliente admin para procurar e atualizar o usuário sem precisar de login
    const supabaseAdmin = createSupabaseAdminClient();

    // 1. Verificar se o usuário existe (percorrendo todas as páginas de usuários)
    const user = await findUser(supabaseAdmin, (u) => u.email?.toLowerCase() === email);

    // Se o usuário não for encontrado, retornamos uma mensagem genérica por segurança,
    // para evitar que alguém use a API para descobrir e-mails cadastrados.
    if (!user) {
      console.warn(`Tentativa de redefinição para e-mail não existente: ${email}`);
      return NextResponse.json({ message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' }, { status: 200 });
    }

    // 2. Gerar um token de redefinição seguro
    const resetToken = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Definir data de expiração (ex: 10 minutos a partir de agora)
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    // 4. Salvar o token hash e a data de expiração no metadado do usuário
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      { user_metadata: { ...user.user_metadata, password_reset_token: passwordResetToken, password_reset_expires: passwordResetExpires.toISOString() } }
    );

    if (updateError) {
      throw updateError;
    }

    // 5. Enviar o e-mail
    const origin = request.headers.get('origin') || request.nextUrl.origin;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: Number(process.env.EMAIL_SERVER_PORT) === 465, // TLS direto apenas na porta 465
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Redefinição de Senha - Aeris Finanças',
      html: `<p>Você solicitou uma redefinição de senha. Clique no link abaixo para criar uma nova senha:</p>
             <a href="${resetUrl}">${resetUrl}</a>
             <p>Este link expira em 10 minutos.</p>
             <p>Se você não solicitou isso, por favor, ignore este e-mail.</p>`,
    });

    return NextResponse.json({ message: 'Se um usuário com este e-mail existir, um link de redefinição será enviado.' }, { status: 200 });

  } catch (error) {
    console.error('Erro na API de forgot-password:', error);
    return NextResponse.json({ message: 'Ocorreu um erro no servidor.' }, { status: 500 });
  }
}
