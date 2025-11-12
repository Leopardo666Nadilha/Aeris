import { Suspense } from 'react';
import styles from '../login/Login.module.css';
import ResetPasswordForm from './ResetPasswordForm';

// Componente de fallback para o Suspense, mostrado enquanto o formulário carrega.
function Loading() {
    return (
        <div className={styles.formContainer}>
            <h1 className={styles.title}>Carregando...</h1>
        </div>
    );
}

export default function ResetPasswordPage() {
  return (
    <section className={styles.container}>
      <Suspense fallback={<Loading />}>
        <ResetPasswordForm />
      </Suspense>
    </section>
  );
}