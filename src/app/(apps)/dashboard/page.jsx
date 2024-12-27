import NavbarPage from '@/layouts/main/NavbarPage';
import DashboardApp from './_components/DashboardApp';
import { AppDashboard } from '@/seo/AppDashboard';
import { landingPage } from '@/seo/LandingPage';

const { title } = AppDashboard;
const { canonical } = landingPage;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}dashboard`,
  },
};

export default async function Dashboard() {
  return (
    <NavbarPage>
      <DashboardApp />
    </NavbarPage>
  );
}
