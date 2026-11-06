'use client';

import { LuArrowDownLeft, LuArrowUpRight, LuPencil, LuTrash2 } from 'react-icons/lu';
import { useCurrency } from '@/contexts/CurrencyContext';
import { formatShortDate } from '../lib/finance';
import styles from './TransactionRow.module.css';

/**
 * Linha de gasto/recebimento. `type` é 'expense' ou 'income'.
 * Com `onEdit`, a linha inteira é clicável (padrão no mobile); no desktop
 * os botões de editar/excluir aparecem ao passar o mouse.
 */
export default function TransactionRow({ item, type, showDate = true, onEdit, onDelete }) {
  const { formatCurrency } = useCurrency();
  const isIncome = type === 'income';
  const meta = [isIncome ? 'Recebimento' : item.category_name, showDate && formatShortDate(item.created_at)]
    .filter(Boolean)
    .join(' · ');

  const body = (
    <>
      <span className={`${styles.icon} ${isIncome ? styles.income : styles.expense}`} aria-hidden="true">
        {isIncome ? <LuArrowDownLeft /> : <LuArrowUpRight />}
      </span>
      <span className={styles.info}>
        <span className={styles.label}>{item.description}</span>
        <span className={styles.meta}>{meta}</span>
      </span>
      <span className={`amount ${isIncome ? 'amount-income' : 'amount-expense'}`}>
        {isIncome ? '+' : '−'} {formatCurrency(item.value)}
      </span>
    </>
  );

  return (
    <li className={styles.row}>
      {onEdit ? (
        <button
          type="button"
          className={`${styles.main} ${styles.clickable}`}
          onClick={() => onEdit(item)}
          aria-label={`Editar ${item.description}`}
        >
          {body}
        </button>
      ) : (
        <div className={styles.main}>{body}</div>
      )}
      {(onEdit || onDelete) && (
        <div className={styles.actions}>
          {onEdit && (
            <button type="button" className="icon-btn" onClick={() => onEdit(item)} aria-label={`Editar ${item.description}`} tabIndex={-1}>
              <LuPencil />
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              className="icon-btn is-danger"
              onClick={() => onDelete(item)}
              aria-label={`Excluir ${item.description}`}
            >
              <LuTrash2 />
            </button>
          )}
        </div>
      )}
    </li>
  );
}
