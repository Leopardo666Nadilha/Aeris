import { createSupabaseServerClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = await createSupabaseServerClient();

  // Invalida a sessão do usuário
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Erro ao fazer logout:', error);
    return NextResponse.json({ message: 'Erro ao sair.' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Logout realizado com sucesso.' });
}
