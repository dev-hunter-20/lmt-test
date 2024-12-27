import { Suspense } from 'react';
import CheckYourEmailPage from './_components/CheckYourEmailPage';

export default function CheckYourEmail() {
  return (
    <Suspense>
      <CheckYourEmailPage />
    </Suspense>
  );
}
