'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const DataContext = createContext();

export function DataProvider({ children }) {
  const supabase = createClientComponentClient();
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]); // Estado para orçamentos
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Efeito para carregar os dados do usuário quando o componente é montado
  useEffect(() => {
    const loadInitialData = async (user) => {
      const [
        { data: categoriesData },
        { data: transactionsData },
        { data: incomesData },
        { data: budgetsData } // Adiciona o carregamento de budgets
      ] = await Promise.all([
        supabase.from('categories').select('*').eq('user_id', user.id),
        supabase.from('transactions').select('*').eq('user_id', user.id),
        supabase.from('incomes').select('*').eq('user_id', user.id),
        supabase.from('budgets').select('*').eq('user_id', user.id) // Busca os orçamentos
      ]);

      setCategories(categoriesData || []);
      setTransactions(transactionsData || []);
      setIncomes(incomesData || []);
      setBudgets(budgetsData || []); // Define os orçamentos
      setLoading(false);
    };

    // Escuta mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        // Se há uma sessão (após login ou no carregamento inicial da página),
        // carregamos os dados. A função `loadInitialData` já define `setLoading(false)` no final.
        loadInitialData(session.user);
      } else {
        // Se não há sessão (logout ou estado inicial sem usuário),
        // limpamos os dados e paramos o carregamento.
        setTransactions([]);
        setIncomes([]);
        setBudgets([]); // Limpa os orçamentos
        setCategories([]);
        setLoading(false);
      }
    });

    // Limpa a inscrição quando o componente é desmontado
    return () => subscription.unsubscribe();
  }, [supabase]);

  // Calcula o saldo dinamicamente
  const balance = useMemo(() => {
    const totalIncomes = incomes.reduce((sum, income) => sum + income.value, 0);
    const totalExpenses = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
    return totalIncomes - totalExpenses;
  }, [incomes, transactions]);

  // --- Funções que interagem com o Supabase ---

  const addTransaction = async (transaction) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        description: transaction.description,
        value: transaction.value,
        category_name: transaction.label, // Mapeia 'label' para a coluna 'category_name'
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar transação:', error);
    } else {
      setTransactions((prev) => [...prev, data]);
    }
  };

  const addIncome = async (income) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('incomes')
      .insert({ ...income, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar renda:', error);
    } else {
      setIncomes((prev) => [...prev, data]);
    }
  };

  const removeTransaction = async (transactionId) => {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) {
      console.error('Erro ao remover transação:', error);
    } else {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
    }
  };

  const updateTransaction = async (transactionId, updatedData) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedData)
      .eq('id', transactionId)
      .select()
      .single();
    if (error) {
      console.error('Erro ao atualizar transação:', error);
    } else {
      setTransactions(prev => prev.map(t => (t.id === transactionId ? data : t)));
    }
  };

  const removeIncome = async (incomeId) => {
    const { error } = await supabase.from('incomes').delete().eq('id', incomeId);
    if (error) {
      console.error('Erro ao remover renda:', error);
    } else {
      setIncomes(prev => prev.filter(i => i.id !== incomeId));
    }
  };

  const updateIncome = async (incomeId, updatedData) => {
    const { data, error } = await supabase.from('incomes').update(updatedData).eq('id', incomeId).select().single();
    if (error) {
      console.error('Erro ao atualizar renda:', error);
    } else {
      setIncomes(prev => prev.map(i => (i.id === incomeId ? data : i)));
    }
  };

  const addCategory = async (category) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Erro ao adicionar categoria:', error);
    } else {
      setCategories((prev) => [...prev, data]);
    }
  };

  const removeCategory = async (categoryName) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const categoryToDelete = categories.find(c => c.name === categoryName);
    if (!categoryToDelete) return;

    const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);

    if (error) {
      console.error('Erro ao remover categoria:', error);
    } else {
      setCategories((prev) => prev.filter(cat => cat.name !== categoryName));
    }
  };

  const updateCategory = async (originalName, updatedCategoryData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const categoryToUpdate = categories.find(c => c.name === originalName);
    if (!categoryToUpdate) return;

    const { data, error } = await supabase
      .from('categories')
      .update({ name: updatedCategoryData.name, goal: updatedCategoryData.goal })
      .eq('id', categoryToUpdate.id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar categoria:', error);
    } else {
      setCategories((prev) => prev.map((cat) => (cat.id === data.id ? data : cat)));
    }
  };

  const value = {
    transactions,
    incomes,
    balance, // Exponha o saldo calculado
    loading, // Garante que o estado de carregamento seja exposto
    categories,
    addCategory,
    addTransaction,
    removeCategory,
    updateCategory,
    addIncome,
    updateTransaction,
    removeTransaction,
    updateIncome,
    removeIncome,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// Hook customizado para facilitar o uso do contexto
export function useData() {
  return useContext(DataContext);
}