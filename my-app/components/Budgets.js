'use client';

import Link from 'next/link';
import { useData } from '../lib/DataContext';
import MonthGoals from './MonthGoals';

const Budgets = () => {
  const { transactions, categories } = useData();

  const goalsForDisplay = categories
    .map(category => {
      const current = transactions
        .filter(t => t.category_name === category.name) // Alterado de t.label para t.category_name
        .reduce((sum, t) => sum + t.value, 0);
      return { ...category, current, progress: category.goal > 0 ? (current / category.goal) : 0 };
    })
    .filter(category => category.goal > 0)
    .sort((a, b) => b.progress - a.progress || b.goal - a.goal)
    .slice(0, 3);

  const shouldShowMonthGoals = goalsForDisplay.some(goal => goal.goal > 0);

  return shouldShowMonthGoals ? (
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