'use client';

import { useState } from 'react';
import { useData } from '../../../lib/DataContext';
import styles from './Budget.module.css';
import { FaTrash, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import ProgressBar from '../../../components/ProgressBar';

export default function BudgetPage() {
  const { budgets, transactions, addBudget, removeBudget, updateBudget } = useData();
  const [newBudgetName, setNewBudgetName] = useState('');
  const [newBudgetGoal, setNewBudgetGoal] = useState('');

  // Estado para controlar a edição inline
  const [editingBudget, setEditingBudget] = useState(null); // Armazena o ID do orçamento em edição
  const [editedBudgetName, setEditedBudgetName] = useState('');
  const [editedBudgetGoal, setEditedBudgetGoal] = useState('');

  // Calcula o gasto atual para cada categoria
  const budgetsWithProgress = budgets.map(budget => {
    const current = transactions
      .filter(t => t.category_name === budget.category_name)
      .reduce((sum, t) => sum + t.value, 0);
    return { ...budget, current };
  });

  const handleAddBudget = (e) => {
    e.preventDefault();
    if (!newBudgetName || !newBudgetGoal || parseFloat(newBudgetGoal) <= 0) {
      alert('Por favor, preencha o nome e um valor de meta válido.');
      return;
    }

    const newBudget = {
      category_name: newBudgetName,
      budget_value: parseFloat(newBudgetGoal),
    };

    addBudget(newBudget);

    setNewBudgetName('');
    setNewBudgetGoal('');
  };

  const handleStartEdit = (budget) => {
    setEditingBudget(budget.id);
    setEditedBudgetName(budget.category_name);
    setEditedBudgetGoal(budget.budget_value.toString());
  };

  const handleCancelEdit = () => {
    setEditingBudget(null);
  };

  const handleSaveEdit = (budgetId) => {
    if (!editedBudgetName || !editedBudgetGoal || parseFloat(editedBudgetGoal) < 0) {
      alert('Por favor, preencha um nome e um valor de meta válido.');
      return;
    }

    const updatedBudgetData = { category_name: editedBudgetName, budget_value: parseFloat(editedBudgetGoal) };
    updateBudget(budgetId, updatedBudgetData);
    setEditingBudget(null);
  };

  return (
    <div className={styles.container}>
      {/* Link para voltar ao dashboard */}
      <Link href="/dashboard" className={styles.backButton}>
        <IoIosArrowBack size={24} />
        Voltar
      </Link>
      <h1 className={styles.title}>Planejamento de Orçamento</h1>

      {/* Seção para adicionar nova categoria */}
      <section className={styles.formSection}>
        <h2>Adicionar Nova Meta</h2>
        <form onSubmit={handleAddBudget} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="budgetName">Nome da Categoria</label>
            <input
              type="text"
              id="budgetName"
              value={newBudgetName}
              onChange={(e) => setNewBudgetName(e.target.value)}
              placeholder="Ex: Educação"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="budgetGoal">Meta Mensal (R$)</label>
            <input
              type="number"
              id="budgetGoal"
              value={newBudgetGoal}
              onChange={(e) => setNewBudgetGoal(e.target.value)}
              placeholder="Ex: 500"
            />
          </div>
          <button type="submit" className="cta-button">Adicionar</button>
        </form>
      </section>

      {/* Lista de categorias com metas */}
      <section className={styles.categoryList}>
        {budgetsWithProgress.map((budget) => (
          <div key={budget.id} className={styles.categoryItem}>
            {editingBudget === budget.id ? (
              // --- MODO DE EDIÇÃO ---
              <>
                <div className={styles.editForm}>
                  <div className={styles.editInputsWrapper}>
                    <input
                      type="text"
                      value={editedBudgetName}
                      onChange={(e) => setEditedBudgetName(e.target.value)}
                      className={styles.editInput}
                    />
                    <input
                      type="number"
                      value={editedBudgetGoal}
                      onChange={(e) => setEditedBudgetGoal(e.target.value)}
                      className={styles.editInput}
                      placeholder="Meta"
                    />
                  </div>
                  <div className={styles.categoryActions}>
                    <button onClick={() => handleSaveEdit(budget.id)} className={styles.actionButton}>
                      <FaSave />
                    </button>
                    <button onClick={handleCancelEdit} className={`${styles.actionButton} ${styles.deleteButton}`}>
                      <FaTimes />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              // --- MODO DE VISUALIZAÇÃO ---
              <>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryInfo}>
                    <span className={styles.categoryName}>{budget.category_name}</span>
                    <span className={styles.categoryValues}>
                      R$ {budget.current.toFixed(2)} / R$ {budget.budget_value.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.categoryActions}>
                    <button onClick={() => handleStartEdit(budget)} className={styles.actionButton}>
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => removeBudget(budget.id)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <ProgressBar current={budget.current} goal={budget.budget_value} />
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}