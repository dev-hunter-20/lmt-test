import NavbarPage from '@/layouts/main/NavbarPage';
import ReviewAppDetail from './_components/ReviewAppDetail';
import { ReviewDetail } from '@/seo/Reviews';

export const generateMetadata = async ({ searchParams }) => {
  const params = new URLSearchParams(searchParams);
  const queryString = Array.from(params.keys())
    .map((key) => `${key}=${encodeURIComponent(params.get(key))}`)
    .join('&');
  const { canonical } = ReviewDetail;

  return {
    alternates: {
      canonical: canonical(queryString),
    },
  };
};

export default function Review() {
  return (
    <NavbarPage>
      <ReviewAppDetail />
    </NavbarPage>
  );
}
