'use client';

import { useState } from 'react';
import { useData } from '../../../lib/DataContext';
import styles from './Budget.module.css';
import { FaTrash, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import Link from 'next/link';
import ProgressBar from '../../../components/ProgressBar';

export default function BudgetPage() {
  const { categories, transactions, addCategory, removeCategory, updateCategory } = useData();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryGoal, setNewCategoryGoal] = useState('');

  // Estado para controlar a edição inline
  const [editingCategory, setEditingCategory] = useState(null); // Armazena o nome da categoria em edição
  const [editedName, setEditedName] = useState('');
  const [editedGoal, setEditedGoal] = useState('');

  // Calcula o gasto atual para cada categoria
  const categoriesWithProgress = categories.map(category => {
    const current = transactions
      .filter(t => t.category_name === category.name)
      .reduce((sum, t) => sum + t.value, 0);
    return { ...category, current };
  });

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName || !newCategoryGoal || parseFloat(newCategoryGoal) <= 0) {
      alert('Por favor, preencha o nome e um valor de meta válido.');
      return;
    }

    const newCategory = {
      name: newCategoryName,
      goal: parseFloat(newCategoryGoal),
    };

    addCategory(newCategory);

    setNewCategoryName('');
    setNewCategoryGoal('');
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category.name);
    setEditedName(category.name);
    setEditedGoal(category.goal.toString());
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleSaveEdit = (originalName) => {
    if (!editedName || !editedGoal || parseFloat(editedGoal) < 0) {
      alert('Por favor, preencha um nome e um valor de meta válido.');
      return;
    }

    const updatedCategory = { name: editedName, goal: parseFloat(editedGoal) };
    updateCategory(originalName, updatedCategory);
    setEditingCategory(null);
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
        <h2>Adicionar Nova Categoria</h2>
        <form onSubmit={handleAddCategory} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="categoryName">Nome da Categoria</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Ex: Educação"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="categoryGoal">Meta Mensal (R$)</label>
            <input
              type="number"
              id="categoryGoal"
              value={newCategoryGoal}
              onChange={(e) => setNewCategoryGoal(e.target.value)}
              placeholder="Ex: 500"
            />
          </div>
          <button type="submit" className="cta-button">Adicionar</button>
        </form>
      </section>

      {/* Lista de categorias com metas */}
      <section className={styles.categoryList}>
        {categoriesWithProgress.map((category) => (
          <div key={category.name} className={styles.categoryItem}>
            {editingCategory === category.name ? (
              // --- MODO DE EDIÇÃO ---
              <>
                <div className={styles.editForm}>
                  <div className={styles.editInputsWrapper}>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={styles.editInput}
                    />
                    <input
                      type="number"
                      value={editedGoal}
                      onChange={(e) => setEditedGoal(e.target.value)}
                      className={styles.editInput}
                      placeholder="Meta"
                    />
                  </div>
                  <div className={styles.categoryActions}>
                    <button onClick={() => handleSaveEdit(category.name)} className={styles.actionButton}>
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
                    <span className={styles.categoryName}>{category.name}</span>
                    <span className={styles.categoryValues}>
                      R$ {category.current.toFixed(2)} / R$ {category.goal.toFixed(2)}
                    </span>
                  </div>
                  <div className={styles.categoryActions}>
                    <button onClick={() => handleStartEdit(category)} className={styles.actionButton}>
                      <FaPencilAlt />
                    </button>
                    <button onClick={() => removeCategory(category.name)} className={`${styles.actionButton} ${styles.deleteButton}`}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <ProgressBar current={category.current} goal={category.goal} />
              </>
            )}
          </div>
        ))}
      </section>
    </div>
  );
}