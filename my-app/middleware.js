import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  // Cria uma resposta inicial. Isso é necessário para que o Supabase possa ler/escrever cookies.
  const res = NextResponse.next();
  
  // Cria um cliente Supabase que pode operar no Middleware.
  const supabase = createMiddlewareClient({ req, res });

  // Atualiza a sessão do usuário. Isso é importante para garantir que a sessão
  // esteja sempre fresca, especialmente em um PWA.
  await supabase.auth.getSession();

  // Obtém os dados do usuário logado.
  const { data: { user } } = await supabase.auth.getUser();

  // --- LÓGICA DE REDIRECIONAMENTO ---

  // 1. Se o usuário ESTÁ logado e tenta acessar as páginas de login ou registro,
  //    redireciona ele para a página inicial.
  if (user && (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 2. Se o usuário NÃO ESTÁ logado e tenta acessar qualquer página protegida,
  //    redireciona ele para a página de login.
  const protectedPaths = ['/', '/dashboard', '/dashboard/budget', '/perfil', '/transacoes'];
  if (!user && protectedPaths.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Se nenhuma das condições acima for atendida, permite que a requisição continue normalmente.
  return res;
}

// Configuração do Middleware: especifica em quais rotas ele deve ser executado.
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard', '/dashboard/budget', '/perfil', '/transacoes'],
};

