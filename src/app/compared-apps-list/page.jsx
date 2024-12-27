import NavbarPage from '@/layouts/main/NavbarPage';
import React from 'react';
import ComparedAppsList from './_components/ComparedAppsList';

export default function page() {
  return (
    <NavbarPage>
      <ComparedAppsList />
    </NavbarPage>
  );
}
