'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useData } from '../lib/DataContext';
import { isAuthPath } from '../lib/routes';
import FabButton from './FabButton';
import BottomSheet from './BottomSheet';

export default function AppLayout({ children }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { budgets, addTransaction, addIncome } = useData();
  const pathname = usePathname();

  const isAuth = isAuthPath(pathname);
  // O botão de adicionar fica fora das páginas de autenticação e do perfil
  const showFab = !isAuth && pathname !== '/perfil';

  return (
    <>
      <main className={`main-content ${isAuth ? 'is-auth' : ''}`}>{children}</main>

      {showFab && (
        <>
          <FabButton onClick={() => setIsBottomSheetOpen(true)} />
          <BottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            categories={budgets}
            onSaveTransaction={addTransaction}
            onSaveIncome={addIncome}
          />
        </>
      )}
    </>
  );
}
