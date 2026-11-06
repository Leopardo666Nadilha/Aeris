'use client';

import { useMemo, useState } from 'react';
import { LuInbox } from 'react-icons/lu';
import PageHeader, { PageLoader } from '../../components/PageHeader';
import SegmentedControl from '../../components/SegmentedControl';
import TransactionRow from '../../components/TransactionRow';
import TransactionForm from '../../components/TransactionForm';
import Modal from '../../components/Modal';
import { useData } from '../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatDayLabel, formatMonthLabel, monthKey, sortByDateDesc, sumValues } from '../../lib/finance';
import styles from './Transacoes.module.css';

const TYPE_FILTERS = [
  { value: 'all', label: 'Tudo' },
  { value: 'expense', label: 'Gastos' },
  { value: 'income', label: 'Recebimentos' },
];

export default function TransacoesPage() {
  const { formatCurrency } = useCurrency();
  const {
    transactions,
    incomes,
    budgets,
    loading,
    updateTransaction,
    removeTransaction,
    updateIncome,
    removeIncome,
  } = useData();

  const [filterMonth, setFilterMonth] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const allItems = useMemo(
    () =>
      sortByDateDesc([
        ...transactions.map((t) => ({ ...t, type: 'expense' })),
        ...incomes.map((i) => ({ ...i, type: 'income' })),
      ]),
    [transactions, incomes]
  );

  // Meses com movimentação, do mais recente para o mais antigo
  const availableMonths = useMemo(
    () => [...new Set(allItems.map((item) => monthKey(item.created_at)))],
    [allItems]
  );

  const filtered = useMemo(
    () =>
      allItems.filter(
        (item) =>
          (filterMonth === 'all' || monthKey(item.created_at) === filterMonth) &&
          (filterType === 'all' || item.type === filterType)
      ),
    [allItems, filterMonth, filterType]
  );

  // Agrupa por dia para a lista
  const groups = useMemo(() => {
    const map = new Map();
    for (const item of filtered) {
      const label = formatDayLabel(item.created_at);
      if (!map.has(label)) map.set(label, []);
      map.get(label).push(item);
    }
    return [...map.entries()];
  }, [filtered]);

  const totalIn = sumValues(filtered.filter((i) => i.type === 'income'));
  const totalOut = sumValues(filtered.filter((i) => i.type === 'expense'));
  const categoryNames = [...new Set(budgets.map((b) => b.category_name))];

  if (loading) return <PageLoader />;

  const handleSave = async (payload) => {
    const result =
      editing.type === 'expense'
        ? await updateTransaction(editing.id, payload)
        : await updateIncome(editing.id, payload);
    if (!result.error) setEditing(null);
    return result;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (deleting.type === 'expense') await removeTransaction(deleting.id);
    else await removeIncome(deleting.id);
    setIsDeleting(false);
    setDeleting(null);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Transações" subtitle="Todo o seu histórico de gastos e recebimentos." />

      <div className={styles.toolbar}>
        <SegmentedControl options={TYPE_FILTERS} value={filterType} onChange={setFilterType} label="Tipo" size="sm" />
        <select
          className={`input ${styles.monthSelect}`}
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          aria-label="Filtrar por mês"
        >
          <option value="all">Todos os meses</option>
          {availableMonths.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span>Entradas</span>
          <strong className="amount amount-income">{formatCurrency(totalIn)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Saídas</span>
          <strong className="amount">{formatCurrency(totalOut)}</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Resultado</span>
          <strong className={`amount ${totalIn - totalOut < 0 ? styles.negative : ''}`}>
            {formatCurrency(totalIn - totalOut)}
          </strong>
        </div>
      </div>

      <section className="card">
        {groups.length > 0 ? (
          groups.map(([label, items]) => (
            <div key={label} className={styles.group}>
              <h2 className={styles.groupTitle}>{label}</h2>
              <ul className={styles.list}>
                {items.map((item) => (
                  <TransactionRow
                    key={`${item.type}-${item.id}`}
                    item={item}
                    type={item.type}
                    showDate={false}
                    onEdit={setEditing}
                    onDelete={setDeleting}
                  />
                ))}
              </ul>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              <LuInbox />
            </span>
            <h3>{allItems.length === 0 ? 'Nenhuma transação ainda' : 'Nada encontrado'}</h3>
            <p>
              {allItems.length === 0
                ? 'Use o botão + para registrar seu primeiro gasto ou recebimento.'
                : 'Nenhuma movimentação corresponde aos filtros selecionados.'}
            </p>
          </div>
        )}
      </section>

      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?.type === 'income' ? 'Editar recebimento' : 'Editar gasto'}
      >
        {editing && (
          <TransactionForm
            key={`${editing.type}-${editing.id}`}
            type={editing.type}
            idPrefix="edit"
            initial={editing}
            categoryNames={categoryNames}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
            onDelete={() => {
              setDeleting(editing);
              setEditing(null);
            }}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>

      <Modal
        isOpen={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        title="Excluir movimentação?"
        description={deleting ? `“${deleting.description}” será excluído permanentemente.` : ''}
        size="sm"
      >
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setDeleting(null)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
