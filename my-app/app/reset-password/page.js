import { Suspense } from 'react';
import AuthShell from '../../components/AuthShell';
import { PageLoader } from '../../components/PageHeader';
import ResetPasswordForm from './ResetPasswordForm';

export default function ResetPasswordPage() {
  return (
    <AuthShell title="Nova senha" subtitle="Escolha uma nova senha para a sua conta.">
      <Suspense fallback={<PageLoader label="Carregando…" />}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
