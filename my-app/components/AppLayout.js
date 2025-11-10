'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation'; // 1. Importe o hook usePathname
import { useData } from '../lib/DataContext'; // Importe o hook de dados
import FabButton from './FabButton';
import BottomSheet from './BottomSheet';

export default function AppLayout({ children }) {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const { categories, addTransaction, addIncome } = useData(); // Obtenha os dados e as funções do contexto
  const pathname = usePathname(); // 2. Obtenha a rota atual

  // 3. Defina as rotas onde os componentes NÃO devem aparecer
  const excludedPaths = ['/perfil'];

  // 4. Verifique se a rota atual está na lista de exclusão
  const shouldShowComponents = !excludedPaths.includes(pathname);

  return (
    <>
      {children}

      {/* 5. Renderize os componentes apenas se a condição for verdadeira */}
      {shouldShowComponents && (
        <>
          <FabButton onClick={() => setIsBottomSheetOpen(true)} />
          <BottomSheet
            isOpen={isBottomSheetOpen}
            onClose={() => setIsBottomSheetOpen(false)}
            categories={categories}
            onSaveTransaction={addTransaction}
            onSaveIncome={addIncome}
          />
        </>
      )}
    </>
  );
}
