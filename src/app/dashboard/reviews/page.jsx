import NavbarPage from '@/layouts/main/NavbarPage';
import DashboardReviewPage from './_components/DashboardReviewPage';
import { DashboardReview } from '@/seo/Reviews';

const { title, canonical } = DashboardReview;

export const metadata = {
  title: title,
  alternates: {
    canonical: canonical,
  },
};

export default function DashBoardReviews() {
  return (
    <NavbarPage>
      <DashboardReviewPage />
    </NavbarPage>
  );
}
