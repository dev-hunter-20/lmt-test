import NavbarPage from '@/layouts/main/NavbarPage';
import DetailReviewApps from './_components/DetailReviewApps';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;

export const metadata = {
  alternates: {
    canonical: `${canonical}top-most-review`,
  },
};

export default function TopMostReview() {
  return (
    <NavbarPage>
      <DetailReviewApps />
    </NavbarPage>
  );
}
