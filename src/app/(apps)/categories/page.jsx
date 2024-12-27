import NavbarPage from '@/layouts/main/NavbarPage';
import Category from './_components/Category';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}categories`,
  },
};

export default function Categories() {
  return (
    <NavbarPage>
      <Category />
    </NavbarPage>
  );
}
