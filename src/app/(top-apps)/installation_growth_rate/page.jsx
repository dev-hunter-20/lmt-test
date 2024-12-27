import NavbarPage from '@/layouts/main/NavbarPage';
import InstallationGrowthRate from './_components/InstallationGrowthRate';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}installation_growth_rate`,
  },
};

export default function InstallationGrowthRatePage() {
  return (
    <NavbarPage>
      <InstallationGrowthRate />
    </NavbarPage>
  );
}
