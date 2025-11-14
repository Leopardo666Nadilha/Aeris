import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Rota para lidar com requisições POST para limpeza de convidados
export async function POST(request) {
  // 1. Verificação de Segurança
  // Pega o token de autorização dos headers da requisição.
  const authHeader = request.headers.get('authorization');
  
  // Compara o token recebido com o token secreto definido nas suas variáveis de ambiente.
  // Isso garante que apenas serviços autorizados (como o Vercel Cron Job) possam executar esta função.
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Acesso não autorizado', { status: 401 });
  }

  // 2. Lógica de Exclusão
  try {
    // Cria um cliente Supabase com a Service Role Key para ter permissões de administrador.
    // É crucial que essa chave NÃO seja exposta no lado do cliente.
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("Iniciando a limpeza de usuários convidados...");

    // Busca todos os usuários anônimos (convidados)
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();

    if (listError) {
      throw new Error(`Erro ao listar usuários: ${listError.message}`);
    }

    // Filtra para garantir que estamos pegando apenas os anônimos
    const guestUsers = users.filter(user => user.is_anonymous);

    if (guestUsers.length === 0) {
      console.log("Nenhum usuário convidado para apagar.");
      return NextResponse.json({ message: 'Nenhum usuário convidado encontrado.' });
    }

    console.log(`Encontrados ${guestUsers.length} usuários convidados para apagar.`);

    // Mapeia as promessas de exclusão
    const deletePromises = guestUsers.map(user =>
      supabaseAdmin.auth.admin.deleteUser(user.id)
    );

    // Executa todas as exclusões em paralelo
    await Promise.all(deletePromises);

    console.log(`Sucesso! ${guestUsers.length} usuários convidados foram apagados.`);

    return NextResponse.json({
      message: `${guestUsers.length} usuários convidados apagados com sucesso.`,
    });

  } catch (error) {
    console.error('Erro ao apagar usuários convidados:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
