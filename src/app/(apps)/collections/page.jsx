import NavbarPage from '@/layouts/main/NavbarPage';
import Collection from './_components/Collection';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}collections`,
  },
};

export default function Collections() {
  return (
    <NavbarPage>
      <Collection />
    </NavbarPage>
  );
}
