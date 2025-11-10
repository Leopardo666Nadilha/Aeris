'use client';

import { createContext, useContext, useState, useMemo } from 'react';

const DataContext = createContext();

// Dados de exemplo que antes estavam na HomePage
const initialTransactions = [];

// Dados de exemplo para receitas
const initialIncomes = [];

// Dados de exemplo que antes estavam na BudgetPage
const initialCategories = [
  { name: 'Alimentação', goal: 0 },
  { name: 'Moradia', goal: 0 },
  { name: 'Transporte', goal: 0 },
  { name: 'Outros', goal: 0 },
];

export function DataProvider({ children }) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [incomes, setIncomes] = useState(initialIncomes);
  const [categories, setCategories] = useState(initialCategories);

  // Calcula o saldo dinamicamente
  const balance = useMemo(() => {
    const totalIncomes = incomes.reduce((sum, income) => sum + income.value, 0);
    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
    return totalIncomes - totalExpenses;
  }, [incomes, transactions]);

  // Função para adicionar uma nova categoria de orçamento
  const addCategory = (category) => {
    setCategories((prev) => [...prev, category]);
  };

  // Função para adicionar uma nova transação
  const addTransaction = (transaction) => {
    // Adiciona a nova transação à lista existente
    setTransactions((prev) => [...prev, transaction]);
  };

  // Função para adicionar uma nova receita
  const addIncome = (income) => {
    setIncomes((prev) => [...prev, income]);
  };

  // Função para remover uma categoria de orçamento
  const removeCategory = (categoryName) => {
    setCategories((prev) => prev.filter(cat => cat.name !== categoryName));
  };

  // Função para editar uma categoria de orçamento
  const updateCategory = (originalName, updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.name === originalName ? updatedCategory : cat))
    );

    // Se o nome da categoria mudou, atualize as transações associadas
    if (originalName !== updatedCategory.name) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.label === originalName ? { ...t, label: updatedCategory.name } : t
        )
      );
    }
  };

  const value = {
    transactions,
    incomes,
    balance, // Exponha o saldo calculado
    categories,
    addCategory,
    addTransaction,
    removeCategory,
    updateCategory,
    addIncome,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Hook customizado para facilitar o uso do contexto
export function useData() {
  return useContext(DataContext);
}