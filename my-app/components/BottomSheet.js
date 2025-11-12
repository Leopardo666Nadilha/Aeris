'use client';
import { useState, useEffect } from 'react';
import styles from './BottomSheet.module.css';
import formStyles from './Form.module.css'; // Importando estilos de formulário compartilhados
import { MdClose } from 'react-icons/md';

export default function BottomSheet({ isOpen, onClose, categories, onSaveTransaction, onSaveIncome }) {
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('expense'); // 'expense' ou 'income'

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = 'hidden'; // Impede o scroll do body quando o sheet está aberto
    } else {
      document.body.style.overflow = '';
      // Atrasar o unmount para permitir a animação de saída
      const timer = setTimeout(() => setIsMounted(false), 300); // Corresponde à duração da transição CSS
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTransaction = {
      label: formData.get('category'),
      value: parseFloat(formData.get('value')),
      description: formData.get('description'),
    };

    if (!newTransaction.label || !newTransaction.value) {
      alert('Por favor, preencha descrição, valor e categoria.');
      return;
    }
    onSaveTransaction(newTransaction);
    onClose();
  };

  const handleIncomeSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newIncome = {
      description: formData.get('description'),
      value: parseFloat(formData.get('value')),
    };

    if (!newIncome.description || !newIncome.value) {
      alert('Por favor, preencha descrição e valor.');
      return;
    }
    onSaveIncome(newIncome);
    onClose();
  };

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ''}`} onClick={onClose}>
      <div className={`${styles.bottomSheet} ${isOpen ? styles.bottomSheetOpen : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          {/* Abas para alternar entre Gasto e Recebimento */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'expense' ? styles.active : ''}`}
              onClick={() => setActiveTab('expense')}
            >
              Gasto
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'income' ? styles.active : ''}`}
              onClick={() => setActiveTab('income')}
            >
              Recebimento
            </button>
          </div>
          <button onClick={onClose} className={styles.closeButton} aria-label="Fechar">
            <MdClose size={24} />
          </button>
        </div>

        {/* Renderiza o formulário correto com base na aba ativa */}
        {activeTab === 'expense' ? (
          <form key="expense-form" onSubmit={handleExpenseSubmit} className={formStyles.form}>
            <div className={formStyles.formGroup}>
              <label htmlFor="expense-description">Descrição</label>
              <input type="text" id="expense-description" name="description" required placeholder="Ex: Almoço no restaurante" />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="expense-value">Valor</label>
              <input type="number" id="expense-value" name="value" step="0.01" required placeholder="Ex: 25,50" />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="expense-category">Categoria</label>
              <select id="expense-category" name="category" required>
                <option value="">Selecione...</option>
                {categories.map((budget) => (
                  <option key={budget.id} value={budget.category_name}>{budget.category_name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="cta-button">Salvar Gasto</button>
          </form>
        ) : (
          <form key="income-form" onSubmit={handleIncomeSubmit} className={formStyles.form}>
            <div className={formStyles.formGroup}>
              <label htmlFor="income-description">Descrição</label>
              <input type="text" id="income-description" name="description" required placeholder="Ex: Salário" />
            </div>
            <div className={formStyles.formGroup}>
              <label htmlFor="income-value">Valor</label>
              <input type="number" id="income-value" name="value" step="0.01" required placeholder="Ex: 3000,00" />
            </div>
            <button type="submit" className="cta-button">Salvar Recebimento</button>
          </form>
        )}
      </div>
    </div>
  );
}