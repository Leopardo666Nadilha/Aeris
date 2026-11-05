import { createClient } from '@supabase/supabase-js';

// Cliente com a chave de serviço — uso exclusivo no servidor (Route Handlers).
export const createSupabaseAdminClient = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

/**
 * Percorre todas as páginas de usuários do Auth.
 * `listUsers()` sem paginação retorna apenas os primeiros 50, o que fazia
 * a redefinição de senha e a limpeza de convidados ignorarem o restante.
 */
export async function* iterateUsers(admin, perPage = 1000) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    yield* data.users;
    if (data.users.length < perPage) return;
  }
}

export async function findUser(admin, predicate) {
  for await (const user of iterateUsers(admin)) {
    if (predicate(user)) return user;
  }
  return null;
}
