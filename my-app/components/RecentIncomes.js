'use client';

import Link from 'next/link';
import { useData } from '../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const RecentIncomes = () => {
  const { incomes } = useData();
  const { formatCurrency } = useCurrency();

  return (
    <>
      {incomes && incomes.length > 0 ? ( // Se houver rendas
        <div className="recent-transactions-list">
          <h3>Últimas Rendas:</h3>
          {incomes.slice(-3).reverse().map((income, index) => (
            <div key={index} className="recent-transaction-item">
              <span className="transaction-label">{income.description}</span>
              <span className="transaction-value income-value">+ {formatCurrency(income.value)}</span>
            </div>
          ))}
        </div>
      ) : ( // Se não houver rendas
        <>
          <h3>Comece a registrar suas rendas</h3>
          <p>Acompanhe suas fontes de renda e veja como elas contribuem para o seu saldo total.</p>
        </>
      )}
      <Link href='/transacoes' className='cta-button'>Ver histórico completo</Link>
    </>
  );
};

export default RecentIncomes;