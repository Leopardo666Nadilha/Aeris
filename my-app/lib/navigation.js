/**
 * Navegação com recarga completa. Usada após login/logout/exclusão de conta para
 * que todos os contextos (DataContext etc.) sejam reiniciados com a nova sessão.
 */
export function hardNavigate(path) {
  window.location.assign(path);
}
