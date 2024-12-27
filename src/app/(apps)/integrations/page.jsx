import NavbarPage from '@/layouts/main/NavbarPage';
import AppListing from './_components/AppListing';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}integrations`,
  },
};

export default function Integrations() {
  return (
    <NavbarPage>
      <AppListing />
    </NavbarPage>
  );
}
