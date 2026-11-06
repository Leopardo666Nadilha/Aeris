// Rotas públicas de autenticação: sem navegação do app nem botão de adicionar.
export const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password'];

export const isAuthPath = (pathname) => AUTH_PATHS.includes(pathname);
