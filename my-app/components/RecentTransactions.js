'use client';

import Link from 'next/link';
import { LuChevronRight, LuReceipt, LuWallet } from 'react-icons/lu';
import { useData } from '../lib/DataContext';
import { sortByDateDesc } from '../lib/finance';
import TransactionRow from './TransactionRow';

const COPY = {
  expense: {
    title: 'Gastos recentes',
    emptyTitle: 'Nenhum gasto ainda',
    emptyText: 'Seus gastos mais recentes aparecem aqui.',
    icon: LuReceipt,
  },
  income: {
    title: 'Recebimentos recentes',
    emptyTitle: 'Nenhum recebimento ainda',
    emptyText: 'Registre salário e outras rendas para acompanhar seu saldo.',
    icon: LuWallet,
  },
};

/** Últimos lançamentos de um tipo, do mais recente para o mais antigo. */
export default function RecentTransactions({ type, limit = 4 }) {
  const { transactions, incomes } = useData();
  const items = sortByDateDesc(type === 'income' ? incomes : transactions).slice(0, limit);
  const copy = COPY[type];
  const Icon = copy.icon;

  return (
    <section className="card">
      <div className="card-header">
        <h2 className="card-title">{copy.title}</h2>
        <Link href="/transacoes" className="card-link">
          Ver tudo <LuChevronRight aria-hidden="true" />
        </Link>
      </div>
      {items.length > 0 ? (
        <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {items.map((item) => (
            <TransactionRow key={item.id} item={item} type={type} />
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <Icon />
          </span>
          <h3>{copy.emptyTitle}</h3>
          <p>{copy.emptyText}</p>
        </div>
      )}
    </section>
  );
}
