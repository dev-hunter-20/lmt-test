import NavbarPage from '@/layouts/main/NavbarPage';
import DeactiveAppList from './_components/DeactiveAppList';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}delisted-deleted`,
  },
};

export default function DelistedOrDeteledApp() {
  return (
    <NavbarPage>
      <DeactiveAppList />
    </NavbarPage>
  );
}
