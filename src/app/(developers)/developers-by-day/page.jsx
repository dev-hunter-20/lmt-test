import NavbarPage from '@/layouts/main/NavbarPage';
import TableListDeveloper from './_components/TableListDeveloper';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}developers-by-day`,
  },
};

export default function DevelopersByDay() {
  return (
    <NavbarPage>
      <TableListDeveloper />
    </NavbarPage>
  );
}
