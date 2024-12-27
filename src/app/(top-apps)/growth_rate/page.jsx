import NavbarPage from '@/layouts/main/NavbarPage';
import { landingPage } from '@/seo/LandingPage';
import GrowthRate from './_components/GrowthRate';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}growth_rate`,
  },
};

export default function GrowthRatePage() {
  return (
    <NavbarPage>
      <GrowthRate />
    </NavbarPage>
  );
}
