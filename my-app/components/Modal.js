'use client';

import { useEffect, useId, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';
import styles from './Modal.module.css';

const EXIT_DURATION = 220; // ms — igual à transição do CSS

/**
 * Diálogo acessível: no mobile aparece como folha inferior, no desktop centralizado.
 * Fecha com Esc ou clique fora e trava o scroll da página enquanto aberto.
 */
export default function Modal({ isOpen, onClose, title, description, children, size = 'md' }) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const titleId = useId();

  // Monta assim que abrir (ajuste de estado durante o render)
  if (isOpen && !isMounted) setIsMounted(true);

  useEffect(() => {
    if (isOpen) {
      // Aguarda um frame para a transição de entrada acontecer
      const frame = requestAnimationFrame(() => setIsVisible(true));
      return () => cancelAnimationFrame(frame);
    }
    const frame = requestAnimationFrame(() => setIsVisible(false));
    const timer = setTimeout(() => setIsMounted(false), EXIT_DURATION);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isMounted || typeof document === 'undefined') return null;

  // Portal no <body>: evita que ancestrais com transform/animação prendam o modal
  // num contexto de empilhamento abaixo da navegação fixa.
  return createPortal(
    <div className={`${styles.overlay} ${isVisible ? styles.visible : ''}`} onMouseDown={onClose}>
      <div
        className={`${styles.dialog} ${styles[size] || ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.handle} aria-hidden="true" />
        {(title || onClose) && (
          <div className={styles.header}>
            <div>
              {title && (
                <h2 id={titleId} className={styles.title}>
                  {title}
                </h2>
              )}
              {description && <p className={styles.description}>{description}</p>}
            </div>
            <button type="button" onClick={onClose} className="icon-btn" aria-label="Fechar">
              <LuX />
            </button>
          </div>
        )}
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  );
}
