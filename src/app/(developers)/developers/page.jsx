import NavbarPage from '@/layouts/main/NavbarPage';
import DashboardDeveloper from './_components/DashboardDeveloper';
import { DeveloperDashboard } from '@/seo/Developer';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;
const { title } = DeveloperDashboard;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}developers`,
  },
};

export default function Developers() {
  return (
    <NavbarPage>
      <DashboardDeveloper />
    </NavbarPage>
  );
}
