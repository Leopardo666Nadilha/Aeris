'use client';

import Link from 'next/link';
import { useData } from '../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const RecentExpenses = () => {
  const { transactions } = useData();
  const { formatCurrency } = useCurrency();

  return (
    <>
      {transactions && transactions.length > 0 ? ( // Se houver transações
        <div className="recent-transactions-list">
          <h3>Últimos Gastos:</h3>
          {transactions.slice(-3).reverse().map((transaction, index) => (
            <div key={index} className="recent-transaction-item">
              <span className="transaction-label">{transaction.label}</span>
              <span className="transaction-value">- {formatCurrency(transaction.value)}</span>
            </div>
          ))}
        </div>
      ) : ( // Se não houver transações
        <>
          <h3>Comece a registrar seus gastos</h3>
          <p>Aqui você poderá ver um resumo dos seus gastos recentes.</p>
        </>
      )}
      <Link href='/transacoes' className='cta-button'>Ver histórico completo</Link>
    </>
  );
};

export default RecentExpenses;