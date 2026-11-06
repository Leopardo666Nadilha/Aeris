'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LuHouse, LuArrowLeftRight, LuTarget, LuUser } from 'react-icons/lu';
import ThemeToggleButton from '../lib/ThemeToggleButton';
import { isAuthPath } from '../lib/routes';
import styles from './Header.module.css';

const NAV_ITEMS = [
  { href: '/', label: 'Início', icon: LuHouse },
  { href: '/transacoes', label: 'Transações', icon: LuArrowLeftRight },
  { href: '/dashboard', label: 'Metas', icon: LuTarget },
  { href: '/perfil', label: 'Perfil', icon: LuUser },
];

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export function Logo() {
  return (
    <span className={styles.logo}>
      <span className={styles.logoMark} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
          <path d="M3 9h11a3 3 0 1 0-3-3" />
          <path d="M3 15h15a3 3 0 1 1-3 3" />
        </svg>
      </span>
      <span className={styles.logoText}>Aeris</span>
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();
  const showNav = !isAuthPath(pathname);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <Link href={showNav ? '/' : '/login'} aria-label="Aeris — início">
            <Logo />
          </Link>

          {showNav && (
            <nav className={styles.desktopNav} aria-label="Navegação principal">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`${styles.desktopLink} ${isActive(pathname, href) ? styles.active : ''}`}
                  aria-current={isActive(pathname, href) ? 'page' : undefined}
                >
                  <Icon aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          )}

          <ThemeToggleButton />
        </div>
      </header>

      {showNav && (
        <nav className={styles.bottomNav} aria-label="Navegação principal">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.bottomLink} ${isActive(pathname, href) ? styles.active : ''}`}
              aria-current={isActive(pathname, href) ? 'page' : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
