import { NextResponse } from 'next/server';
import { createSupabaseAdminClient, iterateUsers } from '@/lib/supabase-admin';

// Usuários convidados com mais de 24h são removidos
const MAX_GUEST_AGE_MS = 24 * 60 * 60 * 1000;

async function cleanupGuests(request) {
  // Apenas o Vercel Cron (ou quem tiver o CRON_SECRET) pode executar
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return new Response('Acesso não autorizado', { status: 401 });
  }

  try {
    const admin = createSupabaseAdminClient();
    const cutoff = Date.now() - MAX_GUEST_AGE_MS;

    // Coleta antes de apagar para não alterar a paginação durante a iteração
    const guests = [];
    for await (const user of iterateUsers(admin)) {
      if (user.is_anonymous && new Date(user.created_at).getTime() < cutoff) guests.push(user);
    }

    if (guests.length === 0) {
      return NextResponse.json({ message: 'Nenhum usuário convidado encontrado.' });
    }

    const results = await Promise.allSettled(guests.map((user) => admin.auth.admin.deleteUser(user.id)));
    const failed = results.filter((r) => r.status === 'rejected' || r.value?.error).length;

    console.log(`Limpeza de convidados: ${guests.length - failed} apagados, ${failed} falhas.`);
    return NextResponse.json({
      message: `${guests.length - failed} usuários convidados apagados.`,
      failed,
    });
  } catch (error) {
    console.error('Erro ao apagar usuários convidados:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// O Vercel Cron dispara requisições GET; POST é mantido para execuções manuais.
export const GET = cleanupGuests;
export const POST = cleanupGuests;
