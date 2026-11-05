// Utilitários de cálculo financeiro compartilhados entre as páginas.

/** Chave "AAAA-MM" de uma data (no fuso local). */
export function monthKey(date) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function currentMonthKey() {
  return monthKey(new Date());
}

/** "2025-11" -> "Novembro de 2025" */
export function formatMonthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  const label = new Date(year, month - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function isInMonth(item, key) {
  return monthKey(item.created_at) === key;
}

export function sumValues(items) {
  return items.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
}

/** Ordena do mais recente para o mais antigo, sem mutar o array original. */
export function sortByDateDesc(items) {
  return [...items].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

/** Gasto do mês corrente por categoria, para acompanhar os orçamentos mensais. */
export function budgetsWithProgress(budgets, transactions, key = currentMonthKey()) {
  const monthTransactions = transactions.filter((t) => isInMonth(t, key));
  return budgets.map((budget) => {
    const current = sumValues(monthTransactions.filter((t) => t.category_name === budget.category_name));
    const progress = budget.budget_value > 0 ? current / budget.budget_value : 0;
    return { ...budget, current, progress };
  });
}

/** Agrupa gastos por categoria, junta o excedente em "Outros" a partir de 6 categorias. */
export function spendingByCategory(transactions, maxSlices = 6) {
  const totals = new Map();
  for (const t of transactions) {
    const name = t.category_name || 'Sem categoria';
    totals.set(name, (totals.get(name) || 0) + (Number(t.value) || 0));
  }
  const sorted = [...totals.entries()]
    .map(([category_name, value]) => ({ category_name, value }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (sorted.length <= maxSlices) return sorted;
  const top = sorted.slice(0, maxSlices - 1);
  const others = sumValues(sorted.slice(maxSlices - 1));
  return [...top, { category_name: 'Outros', value: others }];
}

export function formatShortDate(date) {
  return new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
}

/** Rótulo de agrupamento por dia: "Hoje", "Ontem" ou "12 de novembro". */
export function formatDayLabel(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Hoje';
  if (d.toDateString() === yesterday.toDateString()) return 'Ontem';
  return d.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: d.getFullYear() === today.getFullYear() ? undefined : 'numeric',
  });
}
