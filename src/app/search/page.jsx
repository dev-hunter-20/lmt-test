import NavbarPage from '@/layouts/main/NavbarPage';
import SearchDetail from './_components/SearchDetail';

export const metadata = {
  robots: {
    index: false,
  },
};

export default function SearchPage() {
  return (
    <NavbarPage>
      <SearchDetail />
    </NavbarPage>
  );
}
