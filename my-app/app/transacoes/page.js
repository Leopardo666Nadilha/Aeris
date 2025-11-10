'use client';

import { useData } from '../../lib/DataContext';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io';
import styles from './Transacoes.module.css'; // O Header já não é importado aqui
import { useCurrency } from '@/contexts/CurrencyContext';

export default function TransacoesPage() {
  const { formatCurrency } = useCurrency(); // 2. Obtém a função de formatação
  const { transactions, incomes } = useData();
  const [filterMonth, setFilterMonth] = useState('all');

  const allTransactions = useMemo(() => {
    const expenses = transactions.map(t => ({ ...t, type: 'expense' }));
    const revenues = incomes.map(i => ({ ...i, value: i.value, label: i.description, type: 'income' }));

    // Assumindo que cada transação/renda tem uma propriedade 'date'
    const combined = [...expenses, ...revenues];
    
    // Ordena por data, do mais recente para o mais antigo
    combined.sort((a, b) => new Date(b.date) - new Date(a.date));

    return combined;
  }, [transactions, incomes]);

  // Lógica de filtro (atualmente apenas visual, no futuro, filtrar com base em `filterMonth`)
  const filteredTransactions = allTransactions; 

  return (
    <>
      <main>
        {/* Botão de voltar adicionado, utilizando o estilo do CSS Module local */}
        <Link href="/" className={styles.backButton}>
          <IoIosArrowBack size={24} />
          Voltar
        </Link>
        <h1 className={styles.title}>Histórico de Transações</h1>
        <div className={styles.filterContainer}>
          <label htmlFor="month-filter">Filtrar por mês:</label>
          <select 
            id="month-filter"
            className={styles.monthFilter} 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">Todos os meses</option>
            <option value="2025-11">Novembro/2025</option>
            <option value="2025-10">Outubro/2025</option>
            <option value="2025-09">Setembro/2025</option>
            {/* Adicionar mais meses dinamicamente no futuro */}
          </select>
        </div>

        <div className={styles.transactionList} id='transacoes'>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((item, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionDetails}>
                  <span className={styles.transactionLabel}>{item.label}</span>
                  <span className={styles.transactionDate}>
                    {new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <span className={item.type === 'income' ? styles.incomeValue : styles.expenseValue}>
                  {item.type === 'income' ? '+ ' : '- '}{formatCurrency(item.value)}
                </span>
              </div>
            ))
          ) : (
            <div className={styles.noTransactions}>
              <p>Nenhuma transação registrada ainda.</p>
              <p>Use o botão '+' para adicionar seu primeiro gasto ou recebimento!</p>
            </div>
          )}
        </div>
      </main>
    </>

  );
}