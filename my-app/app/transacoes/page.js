'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { IoIosArrowBack } from 'react-icons/io'; // Ícone de voltar
import { FaPencilAlt, FaTrash } from 'react-icons/fa'; // Ícones para ações
import { useData } from '../../lib/DataContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import Modal from '../../components/Modal'; // Componente de Modal
import styles from './Transacoes.module.css'; // O Header já não é importado aqui

export default function TransacoesPage() {
  const { formatCurrency } = useCurrency(); // 2. Obtém a função de formatação
  const {
    transactions,
    incomes,
    categories,
    updateTransaction,
    removeTransaction,
    updateIncome,
    removeIncome,
  } = useData();
  const [filterMonth, setFilterMonth] = useState('all');

  // Estados para controlar os modais
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const allTransactions = useMemo(() => {
    const expenses = transactions.map(t => ({ ...t, label: t.description, type: 'expense' }));
    const revenues = incomes.map(i => ({ ...i, value: i.value, label: i.description, type: 'income' }));

    // Combina os dois arrays
    const combined = [...expenses, ...revenues];
    
    // Ordena por data (usando a propriedade 'created_at'), do mais recente para o mais antigo
    combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return combined;
  }, [transactions, incomes]);

  // Gera a lista de meses disponíveis para o filtro, com base nas transações existentes.
  const availableMonths = useMemo(() => {
    const months = new Set();
    allTransactions.forEach(item => {
      const itemDate = new Date(item.created_at);
      const year = itemDate.getFullYear();
      const month = (itemDate.getMonth() + 1).toString().padStart(2, '0'); // Adiciona zero à esquerda se necessário
      months.add(`${year}-${month}`);
    });
    return Array.from(months);
  }, [allTransactions]);

  // Filtra as transações com base no mês selecionado.
  const filteredTransactions = useMemo(() => {
    if (filterMonth === 'all') {
      return allTransactions;
    }
    return allTransactions.filter(item => {
      const itemDate = new Date(item.created_at);
      const year = itemDate.getFullYear();
      const month = (itemDate.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}` === filterMonth;
    });
  }, [allTransactions, filterMonth]);

  // --- Manipuladores para os Modais ---

  const handleOpenEditModal = (item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setSelectedItem(null);
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      description: formData.get('description'),
      value: parseFloat(formData.get('value')),
    };

    if (selectedItem.type === 'expense') {
      updatedData.category_name = formData.get('category');
      updateTransaction(selectedItem.id, updatedData);
    } else {
      updateIncome(selectedItem.id, updatedData);
    }

    handleCloseModals();
  };

  const handleDeleteItem = () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'expense') {
      removeTransaction(selectedItem.id);
    } else {
      removeIncome(selectedItem.id);
    }

    handleCloseModals();
  };


  return (
    <>
      <main>
        {/* Botão de voltar adicionado, utilizando o estilo do CSS Module local */}
        <Link href="/" className={styles.backButton}>
          <IoIosArrowBack size={24} />
          Voltar
        </Link>
        <h1 className={styles.title}>Histórico de Transações</h1>
        <div className={styles.filterContainer}>
          <label htmlFor="month-filter">Filtrar por mês:</label>
          <select 
            id="month-filter"
            className={styles.monthFilter} 
            value={filterMonth} 
            onChange={(e) => setFilterMonth(e.target.value)}
          >
            <option value="all">Todos os meses</option>
            {availableMonths.map(month => {
              const [year, monthNum] = month.split('-');
              const date = new Date(year, monthNum - 1);
              // Formata o nome do mês para exibição (ex: "Novembro/2025")
              const monthName = date.toLocaleString('pt-BR', { month: 'long' });
              const formattedLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)}/${year}`;
              return (
                <option key={month} value={month}>
                  {formattedLabel}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.transactionList} id='transacoes'>
          {filteredTransactions.length > 0 ? (
            filteredTransactions.map((item, index) => (
              <div key={index} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionDetails}>
                    <span className={styles.transactionLabel}>{item.label}</span>
                    <span className={styles.transactionDate}>{/* Usa a propriedade correta 'created_at' */}
                      {new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>
                  </div>
                  <span className={item.type === 'income' ? styles.incomeValue : styles.expenseValue}>
                    {item.type === 'income' ? '+ ' : '- '}{formatCurrency(item.value)}
                  </span>
                </div>
                <div className={styles.transactionActions}>
                  <button onClick={() => handleOpenEditModal(item)} className={styles.actionButton} aria-label="Editar">
                    <FaPencilAlt />
                  </button>
                  <button onClick={() => handleOpenDeleteModal(item)} className={`${styles.actionButton} ${styles.deleteButton}`} aria-label="Excluir">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noTransactions}>
              <p>Nenhuma transação registrada ainda.</p>
              <p>Use o botão '+' para adicionar seu primeiro gasto ou recebimento!</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal de Edição */}
      {selectedItem && (
        <Modal isOpen={isEditModalOpen} onClose={handleCloseModals} title={`Editar ${selectedItem.type === 'income' ? 'Renda' : 'Gasto'}`}>
          <form onSubmit={handleSaveChanges} className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label htmlFor="description">Descrição</label>
              <input type="text" id="description" name="description" defaultValue={selectedItem.description} required />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="value">Valor</label>
              <input type="number" id="value" name="value" defaultValue={selectedItem.value} step="0.01" required />
            </div>
            {selectedItem.type === 'expense' && (
              <div className={styles.formGroup}>
                <label htmlFor="category">Categoria</label>
                <select id="category" name="category" defaultValue={selectedItem.category_name} required>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            <div className={styles.modalActions}>
              <button type="button" onClick={handleCloseModals} className={`${styles.modalButton} ${styles.cancelButton} ${styles.cancelButtonBudget}`}>
                Cancelar
              </button>
              <button type="submit" className="cta-button">
                Salvar Alterações
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de Exclusão */}
      {selectedItem && (
        <Modal isOpen={isDeleteModalOpen} onClose={handleCloseModals} title="Confirmar Exclusão">
          <div className={styles.modalContent}>
            <p>
              Você tem certeza que deseja excluir a {selectedItem.type === 'income' ? 'renda' : 'transação'}: <strong>"{selectedItem.description}"</strong>?
            </p>
            <p className={styles.warningText}>
              Esta ação não pode ser desfeita.
            </p>
            <div className={styles.modalActions}>
              <button type="button" onClick={handleCloseModals} className={`${styles.modalButton} ${styles.cancelButton} ${styles.cancelButtonExclude}`}>
                Cancelar
              </button>
              <button onClick={handleDeleteItem} className="destructive-button">
                Excluir
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>

  );
}