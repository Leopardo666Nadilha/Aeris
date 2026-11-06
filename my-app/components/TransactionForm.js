'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCurrency } from '@/contexts/CurrencyContext';

/**
 * Formulário de gasto ou recebimento, usado para criar (BottomSheet) e editar (Transações).
 * `onSubmit` recebe os dados e deve retornar `{ error }`.
 */
export default function TransactionForm({
  type,
  categoryNames = [],
  initial,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel,
  idPrefix = 'tx',
}) {
  const { currency, supportedCurrencies } = useCurrency();
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const isExpense = type === 'expense';

  // Mantém a categoria atual na lista mesmo que o orçamento correspondente tenha sido removido
  const options =
    initial?.category_name && !categoryNames.includes(initial.category_name)
      ? [initial.category_name, ...categoryNames]
      : categoryNames;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const description = String(formData.get('description') || '').trim();
    const value = Number(String(formData.get('value') || '').replace(',', '.'));
    const category = formData.get('category');

    if (!description) return setError('Informe uma descrição.');
    if (!Number.isFinite(value) || value <= 0) return setError('Informe um valor maior que zero.');
    if (isExpense && !category) return setError('Escolha uma categoria.');

    setSaving(true);
    const payload = isExpense ? { description, value, category_name: category } : { description, value };
    const result = await onSubmit(payload);
    setSaving(false);
    if (result?.error) setError('Não foi possível salvar. Tente novamente.');
  };

  if (isExpense && options.length === 0) {
    return (
      <div className="empty-state">
        <h3>Crie uma categoria primeiro</h3>
        <p>Os gastos são organizados pelas categorias dos seus orçamentos.</p>
        <Link href="/dashboard/budget" className="btn btn-primary" onClick={onCancel}>
          Criar categoria
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="form" noValidate>
      <div className="field">
        <label className="field-label" htmlFor={`${idPrefix}-value`}>
          Valor
        </label>
        <div className="input-money">
          <span>{supportedCurrencies[currency].symbol}</span>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            id={`${idPrefix}-value`}
            name="value"
            step="0.01"
            min="0.01"
            defaultValue={initial?.value ?? ''}
            placeholder="0,00"
            autoFocus={!initial}
            required
          />
        </div>
      </div>

      <div className="field">
        <label className="field-label" htmlFor={`${idPrefix}-description`}>
          Descrição
        </label>
        <input
          className="input"
          type="text"
          id={`${idPrefix}-description`}
          name="description"
          defaultValue={initial?.description ?? ''}
          placeholder={isExpense ? 'Ex: Almoço no restaurante' : 'Ex: Salário'}
          maxLength={80}
          required
        />
      </div>

      {isExpense && (
        <div className="field">
          <label className="field-label" htmlFor={`${idPrefix}-category`}>
            Categoria
          </label>
          <select
            className="input"
            id={`${idPrefix}-category`}
            name="category"
            defaultValue={initial?.category_name ?? ''}
            required
          >
            <option value="" disabled>
              Selecione…
            </option>
            {options.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && (
        <p className="alert alert-error" role="alert">
          {error}
        </p>
      )}

      <div className="form-actions">
        {onDelete && (
          <button type="button" className="btn btn-danger-outline" onClick={onDelete} style={{ marginRight: 'auto' }}>
            Excluir
          </button>
        )}
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={saving}>
          {saving ? 'Salvando…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
