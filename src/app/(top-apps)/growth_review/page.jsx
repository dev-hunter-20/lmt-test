import NavbarPage from '@/layouts/main/NavbarPage';
import GrowthReview from './_components/GrowthReview';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-reviewed`,
  },
};

export default function TopReviewed() {
  return (
    <NavbarPage>
      <GrowthReview />
    </NavbarPage>
  );
}
