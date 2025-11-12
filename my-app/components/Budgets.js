'use client';

import Link from 'next/link';
import { useData } from '../lib/DataContext';
import MonthGoals from './MonthGoals';

const Budgets = () => {
  const { transactions, budgets, loading } = useData();

  // Adiciona uma verificação de carregamento.
  // Isso impede que o componente tente renderizar antes que os dados estejam prontos.
  if (loading) {
    return <p>Carregando metas...</p>;
  }

  const goalsForDisplay = budgets
    .filter(budget => budget.budget_value > 0) // Mostra apenas metas com valor definido
    .map(budget => {
      const current = transactions
        .filter(t => t.category_name === budget.category_name)
        .reduce((sum, t) => sum + t.value, 0);
      return { ...budget, current, progress: budget.budget_value > 0 ? (current / budget.budget_value) : 0 };
    })
    .sort((a, b) => b.progress - a.progress || b.budget_value - a.budget_value)
    .slice(0, 3);

  return goalsForDisplay.length > 0 ? (
    <>
      <MonthGoals goals={goalsForDisplay} />
      <Link href='/dashboard' className='cta-button'>Ver Dashboard Completo</Link>
    </>
  ) : (
    <>
    <h3>Comece a planejar seus gastos</h3>
    <p>Crie orçamentos para suas categorias e acompanhe seu progresso diretamente aqui.</p><Link href='/dashboard/budget' className='cta-button'>Comece a planejar</Link>
    </>
  );
};

export default Budgets;