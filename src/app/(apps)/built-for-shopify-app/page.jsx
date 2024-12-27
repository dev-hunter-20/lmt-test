import ListAppByDay from '@/components/list-app/ListAppByDay';
import NavbarPage from '@/layouts/main/NavbarPage';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}built-for-shopify-app`,
  },
};

export default function AppByDay() {
  return (
    <NavbarPage>
      <ListAppByDay />
    </NavbarPage>
  );
}
