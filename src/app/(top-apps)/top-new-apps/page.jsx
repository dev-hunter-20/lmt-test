import NavbarPage from '@/layouts/main/NavbarPage';
import TopNewApp from './_components/NewApps';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-new-apps`,
  },
};

export default function TopNewApps() {
  return (
    <NavbarPage>
      <TopNewApp />
    </NavbarPage>
  );
}
