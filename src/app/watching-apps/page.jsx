import NavbarPage from '@/layouts/main/NavbarPage';
import WatchingAppsComponent from './_components/WatchingApps';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}watching-apps`,
  },
};

export default function WatchingApps() {
  return (
    <NavbarPage>
      <WatchingAppsComponent />
    </NavbarPage>
  );
}
