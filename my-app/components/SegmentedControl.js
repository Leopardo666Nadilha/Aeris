'use client';

import styles from './SegmentedControl.module.css';

export default function SegmentedControl({ options, value, onChange, label, size }) {
  return (
    <div className={`${styles.control} ${size === 'sm' ? styles.sm : ''}`} role="tablist" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          className={`${styles.option} ${value === option.value ? styles.active : ''}`}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
