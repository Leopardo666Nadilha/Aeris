'use client';

import { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase-browser';
import { sumValues } from './finance';

const DataContext = createContext(null);

/**
 * Estado global dos dados financeiros do usuário.
 * Todas as funções de escrita retornam `{ error }` (null em caso de sucesso)
 * para que a interface possa exibir a falha ao usuário.
 */
export function DataProvider({ children }) {
  // Um único cliente por montagem do provider
  const [supabase] = useState(createSupabaseBrowserClient);
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadInitialData = async (currentUser) => {
      const [categoriesRes, transactionsRes, incomesRes, budgetsRes] = await Promise.all([
        supabase.from('categories').select('*').eq('user_id', currentUser.id),
        supabase.from('transactions').select('*').eq('user_id', currentUser.id),
        supabase.from('incomes').select('*').eq('user_id', currentUser.id),
        supabase.from('budgets').select('*').eq('user_id', currentUser.id),
      ]);
      if (cancelled) return;

      [categoriesRes, transactionsRes, incomesRes, budgetsRes].forEach(({ error }) => {
        if (error) console.error('Erro ao carregar dados:', error);
      });

      setCategories(categoriesRes.data || []);
      setTransactions(transactionsRes.data || []);
      setIncomes(incomesRes.data || []);
      setBudgets(budgetsRes.data || []);
      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);

      // Renovações de token não precisam recarregar tudo
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return;

      if (sessionUser) {
        setLoading(true);
        // Adiado para fora do callback: o Supabase recomenda não aguardar chamadas dentro dele
        setTimeout(() => loadInitialData(sessionUser), 0);
      } else {
        setTransactions([]);
        setIncomes([]);
        setBudgets([]);
        setCategories([]);
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const balance = useMemo(() => sumValues(incomes) - sumValues(transactions), [incomes, transactions]);

  const requireUser = useCallback(async () => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    return currentUser;
  }, [supabase]);

  const fail = (message, error) => {
    console.error(message, error);
    return { error: error ?? new Error(message) };
  };

  // --- Transações (gastos) ---

  const addTransaction = async (transaction) => {
    const currentUser = await requireUser();
    if (!currentUser) return fail('Sessão expirada.');

    const { data, error } = await supabase
      .from('transactions')
      .insert({
        description: transaction.description,
        value: transaction.value,
        category_name: transaction.label,
        user_id: currentUser.id,
      })
      .select()
      .single();

    if (error) return fail('Erro ao adicionar transação:', error);
    setTransactions((prev) => [...prev, data]);
    return { error: null };
  };

  const updateTransaction = async (transactionId, updatedData) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updatedData)
      .eq('id', transactionId)
      .select()
      .single();
    if (error) return fail('Erro ao atualizar transação:', error);
    setTransactions((prev) => prev.map((t) => (t.id === transactionId ? data : t)));
    return { error: null };
  };

  const removeTransaction = async (transactionId) => {
    const { error } = await supabase.from('transactions').delete().eq('id', transactionId);
    if (error) return fail('Erro ao remover transação:', error);
    setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    return { error: null };
  };

  // --- Rendas ---

  const addIncome = async (income) => {
    const currentUser = await requireUser();
    if (!currentUser) return fail('Sessão expirada.');

    const { data, error } = await supabase
      .from('incomes')
      .insert({ ...income, user_id: currentUser.id })
      .select()
      .single();

    if (error) return fail('Erro ao adicionar renda:', error);
    setIncomes((prev) => [...prev, data]);
    return { error: null };
  };

  const updateIncome = async (incomeId, updatedData) => {
    const { data, error } = await supabase.from('incomes').update(updatedData).eq('id', incomeId).select().single();
    if (error) return fail('Erro ao atualizar renda:', error);
    setIncomes((prev) => prev.map((i) => (i.id === incomeId ? data : i)));
    return { error: null };
  };

  const removeIncome = async (incomeId) => {
    const { error } = await supabase.from('incomes').delete().eq('id', incomeId);
    if (error) return fail('Erro ao remover renda:', error);
    setIncomes((prev) => prev.filter((i) => i.id !== incomeId));
    return { error: null };
  };

  // --- Categorias (tabela legada; os orçamentos são a fonte de categorias da interface) ---

  const addCategory = async (category) => {
    const currentUser = await requireUser();
    if (!currentUser) return fail('Sessão expirada.');
    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, user_id: currentUser.id })
      .select()
      .single();
    if (error) return fail('Erro ao adicionar categoria:', error);
    setCategories((prev) => [...prev, data]);
    return { error: null };
  };

  const removeCategory = async (categoryName) => {
    const categoryToDelete = categories.find((c) => c.name === categoryName);
    if (!categoryToDelete) return { error: null };
    const { error } = await supabase.from('categories').delete().eq('id', categoryToDelete.id);
    if (error) return fail('Erro ao remover categoria:', error);
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryToDelete.id));
    return { error: null };
  };

  const updateCategory = async (originalName, updatedCategoryData) => {
    const categoryToUpdate = categories.find((c) => c.name === originalName);
    if (!categoryToUpdate) return { error: null };
    const { data, error } = await supabase
      .from('categories')
      .update({ name: updatedCategoryData.name, goal: updatedCategoryData.goal })
      .eq('id', categoryToUpdate.id)
      .select()
      .single();
    if (error) return fail('Erro ao atualizar categoria:', error);
    setCategories((prev) => prev.map((cat) => (cat.id === data.id ? data : cat)));
    return { error: null };
  };

  // --- Orçamentos (cada orçamento define uma categoria de gasto) ---

  const addBudget = async (budgetData) => {
    const currentUser = await requireUser();
    if (!currentUser) return fail('Sessão expirada.');

    const { data, error } = await supabase
      .from('budgets')
      .insert({ ...budgetData, user_id: currentUser.id })
      .select()
      .single();

    if (error) return fail('Erro ao adicionar orçamento:', error);
    setBudgets((prev) => [...prev, data]);
    return { error: null };
  };

  const removeBudget = async (budgetId) => {
    const { error } = await supabase.from('budgets').delete().eq('id', budgetId);
    if (error) return fail('Erro ao remover orçamento:', error);
    setBudgets((prev) => prev.filter((b) => b.id !== budgetId));
    return { error: null };
  };

  const updateBudget = async (budgetId, updatedData) => {
    const previous = budgets.find((b) => b.id === budgetId);

    const { data, error } = await supabase
      .from('budgets')
      .update(updatedData)
      .eq('id', budgetId)
      .select()
      .single();

    if (error) return fail('Erro ao atualizar orçamento:', error);
    setBudgets((prev) => prev.map((budget) => (budget.id === budgetId ? data : budget)));

    // Ao renomear a categoria, os gastos ligados a ela acompanham o novo nome.
    // Sem isso, o progresso do orçamento renomeado voltava para zero.
    const oldName = previous?.category_name;
    const newName = data.category_name;
    if (oldName && newName && oldName !== newName) {
      const currentUser = await requireUser();
      if (currentUser) {
        const { error: renameError } = await supabase
          .from('transactions')
          .update({ category_name: newName })
          .eq('user_id', currentUser.id)
          .eq('category_name', oldName);
        if (renameError) return fail('Erro ao renomear a categoria dos gastos:', renameError);
        setTransactions((prev) =>
          prev.map((t) => (t.category_name === oldName ? { ...t, category_name: newName } : t))
        );
      }
    }
    return { error: null };
  };

  const value = {
    user,
    isGuest: Boolean(user?.is_anonymous),
    transactions,
    incomes,
    balance,
    loading,
    categories,
    addCategory,
    removeCategory,
    updateCategory,
    addTransaction,
    updateTransaction,
    removeTransaction,
    addIncome,
    updateIncome,
    removeIncome,
    budgets,
    addBudget,
    updateBudget,
    removeBudget,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData deve ser usado dentro de <DataProvider>.');
  return context;
}
