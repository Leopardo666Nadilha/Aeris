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
    const expenses = transactions.map(t => ({ ...t, label: t.description, type: 'expense' }));
    const revenues = incomes.map(i => ({ ...i, value: i.value, label: i.description, type: 'income' }));

    // Combina os dois arrays
    const combined = [...expenses, ...revenues];
    
    // Ordena por data (usando a propriedade 'created_at'), do mais recente para o mais antigo
    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return combined;
  }, [transactions, incomes]);

  // Gera a lista de meses disponíveis para o filtro, com base nas transações existentes.
  const availableMonths = useMemo(() => {
    const months = new Set();
    allTransactions.forEach(item => {
      const itemDate = new Date(item.created_at);
      const year = itemDate.getFullYear();
      const month = (itemDate.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
      months.add(`${year}-${month}`);
    });
    return Array.from(months);
  }, [allTransactions]);

  // Filtra as transações com base no mês selecionado.
  const filteredTransactions = useMemo(() => {
    if (filterMonth === 'all') {
      return allTransactions;
    }
    return allTransactions.filter(item => {
      const itemDate = new Date(item.created_at);
      const year = itemDate.getFullYear();
      const month = (itemDate.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}` === filterMonth;
    });
  }, [allTransactions, filterMonth]);

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
            {availableMonths.map(month => {
              const [year, monthNum] = month.split('-');
              const date = new Date(year, monthNum - 1);
              // Formata o nome do mês para exibição (ex: "Novembro/2025")
              const monthName = date.toLocaleString('pt-BR', { month: 'long' });
              const formattedLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year}`;
              return (
                <option key={month} value={month}>
                  {formattedLabel}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.transactionList} id='transacoes'>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((item, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionDetails}>
                  <span className={styles.transactionLabel}>{item.label}</span>
                  <span className={styles.transactionDate}>{/* Usa a propriedade correta 'created_at' */}
                    {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
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