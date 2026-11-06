'use client';

import { useState } from 'react';
import Modal from './Modal';
import TransactionForm from './TransactionForm';
import SegmentedControl from './SegmentedControl';

const TABS = [
  { value: 'expense', label: 'Gasto' },
  { value: 'income', label: 'Recebimento' },
];

export default function BottomSheet({ isOpen, onClose, categories, onSaveTransaction, onSaveIncome }) {
  const [activeTab, setActiveTab] = useState('expense');
  const categoryNames = [...new Set(categories.map((b) => b.category_name))];

  const handleSave = async (payload) => {
    const result =
      activeTab === 'expense'
        ? await onSaveTransaction({ label: payload.category_name, value: payload.value, description: payload.description })
        : await onSaveIncome(payload);
    if (!result?.error) onClose();
    return result;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nova movimentação">
      <SegmentedControl options={TABS} value={activeTab} onChange={setActiveTab} label="Tipo de movimentação" />
      <TransactionForm
        key={activeTab}
        type={activeTab}
        idPrefix={`new-${activeTab}`}
        categoryNames={categoryNames}
        onSubmit={handleSave}
        onCancel={onClose}
        submitLabel={activeTab === 'expense' ? 'Salvar gasto' : 'Salvar recebimento'}
      />
    </Modal>
  );
}
