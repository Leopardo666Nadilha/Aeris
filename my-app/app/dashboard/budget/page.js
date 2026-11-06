'use client';

import { useState } from 'react';
import { LuCheck, LuPencil, LuTrash2, LuX } from 'react-icons/lu';
import PageHeader, { PageLoader } from '../../../components/PageHeader';
import BudgetRow from '../../../components/BudgetRow';
import Modal from '../../../components/Modal';
import { useData } from '../../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { budgetsWithProgress } from '../../../lib/finance';
import styles from './Budget.module.css';

const parseAmount = (value) => Number(String(value).replace(',', '.'));

export default function BudgetPage() {
  const { budgets, transactions, addBudget, removeBudget, updateBudget, loading } = useData();
  const { currency, supportedCurrencies } = useCurrency();
  const symbol = supportedCurrencies[currency].symbol;

  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [formError, setFormError] = useState('');
  const [adding, setAdding] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editGoal, setEditGoal] = useState('');
  const [editError, setEditError] = useState('');

  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (loading) return <PageLoader />;

  const items = budgetsWithProgress(budgets, transactions);
  const nameExists = (name, ignoreId) =>
    budgets.some((b) => b.id !== ignoreId && b.category_name.trim().toLowerCase() === name.trim().toLowerCase());

  const handleAdd = async (e) => {
    e.preventDefault();
    setFormError('');
    const name = newName.trim();
    const goal = parseAmount(newGoal);
    if (!name) return setFormError('Dê um nome à categoria.');
    if (nameExists(name)) return setFormError('Já existe uma categoria com esse nome.');
    if (!Number.isFinite(goal) || goal <= 0) return setFormError('Informe uma meta mensal maior que zero.');

    setAdding(true);
    const { error } = await addBudget({ category_name: name, budget_value: goal });
    setAdding(false);
    if (error) return setFormError('Não foi possível criar o orçamento. Tente novamente.');
    setNewName('');
    setNewGoal('');
  };

  const startEdit = (budget) => {
    setEditingId(budget.id);
    setEditName(budget.category_name);
    setEditGoal(String(budget.budget_value));
    setEditError('');
  };

  const saveEdit = async (budgetId) => {
    const name = editName.trim();
    const goal = parseAmount(editGoal);
    if (!name) return setEditError('Dê um nome à categoria.');
    if (nameExists(name, budgetId)) return setEditError('Já existe uma categoria com esse nome.');
    if (!Number.isFinite(goal) || goal < 0) return setEditError('Informe uma meta válida.');

    const { error } = await updateBudget(budgetId, { category_name: name, budget_value: goal });
    if (error) return setEditError('Não foi possível salvar. Tente novamente.');
    setEditingId(null);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await removeBudget(toDelete.id);
    setDeleting(false);
    setToDelete(null);
  };

  return (
    <div className="fade-up">
      <PageHeader
        title="Planejamento"
        subtitle="Cada orçamento cria uma categoria para os seus gastos."
        backHref="/dashboard"
        backLabel="Metas"
      />

      <div className={styles.layout}>
        <section className={`card ${styles.formCard}`}>
          <h2 className="card-title" style={{ marginBottom: '1rem' }}>
            Nova categoria
          </h2>
          <form onSubmit={handleAdd} className="form" noValidate>
            <div className="field">
              <label className="field-label" htmlFor="budgetName">
                Nome
              </label>
              <input
                className="input"
                type="text"
                id="budgetName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ex: Mercado"
                maxLength={40}
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="budgetGoal">
                Meta mensal
              </label>
              <div className="input-money">
                <span>{symbol}</span>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  id="budgetGoal"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  placeholder="500,00"
                />
              </div>
            </div>
            {formError && (
              <p className="alert alert-error" role="alert">
                {formError}
              </p>
            )}
            <button type="submit" className="btn btn-primary btn-block" disabled={adding}>
              {adding ? 'Adicionando…' : 'Adicionar categoria'}
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-header">
            <h2 className="card-title">Suas categorias</h2>
            <span className="eyebrow">{items.length}</span>
          </div>

          {items.length === 0 ? (
            <div className="empty-state">
              <h3>Nenhuma categoria ainda</h3>
              <p>Crie a primeira ao lado — por exemplo Mercado, Transporte ou Lazer.</p>
            </div>
          ) : (
            <ul className={styles.list}>
              {items.map((budget) => (
                <li key={budget.id} className={styles.item}>
                  {editingId === budget.id ? (
                    <div className={styles.editForm}>
                      <div className={styles.editInputs}>
                        <input
                          className="input"
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          aria-label="Nome da categoria"
                          maxLength={40}
                          autoFocus
                        />
                        <div className="input-money">
                          <span>{symbol}</span>
                          <input
                            className="input"
                            type="number"
                            inputMode="decimal"
                            step="0.01"
                            min="0"
                            value={editGoal}
                            onChange={(e) => setEditGoal(e.target.value)}
                            aria-label="Meta mensal"
                          />
                        </div>
                      </div>
                      {editError && <p className="alert alert-error">{editError}</p>}
                      <div className={styles.editActions}>
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                          <LuX aria-hidden="true" /> Cancelar
                        </button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={() => saveEdit(budget.id)}>
                          <LuCheck aria-hidden="true" /> Salvar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <BudgetRow
                      budget={budget}
                      actions={
                        <>
                          <button
                            type="button"
                            className="icon-btn"
                            onClick={() => startEdit(budget)}
                            aria-label={`Editar ${budget.category_name}`}
                          >
                            <LuPencil />
                          </button>
                          <button
                            type="button"
                            className="icon-btn is-danger"
                            onClick={() => setToDelete(budget)}
                            aria-label={`Excluir ${budget.category_name}`}
                          >
                            <LuTrash2 />
                          </button>
                        </>
                      }
                    />
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <Modal
        isOpen={Boolean(toDelete)}
        onClose={() => setToDelete(null)}
        title="Excluir categoria?"
        description={toDelete ? `O orçamento “${toDelete.category_name}” será removido. Os gastos já registrados continuam no histórico.` : ''}
        size="sm"
      >
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={() => setToDelete(null)}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Excluindo…' : 'Excluir'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
