import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

export async function proxy(req) {
  // Cria uma resposta inicial. Isso é necessário para que o Supabase possa ler/escrever cookies.
  let res = NextResponse.next({ request: req });
  
  // Cria um cliente Supabase que pode operar no Proxy, propagando cookies renovados na resposta.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          res = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
        },
      },
    }
  );

  // Obtém os dados do usuário logado (também renova a sessão, se necessário).
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

// Configuração do Proxy: especifica em quais rotas ele deve ser executado.
export const config = {
  matcher: ['/', '/login', '/register', '/dashboard', '/dashboard/budget', '/perfil', '/transacoes'],
};

