import NavbarPage from '@/layouts/main/NavbarPage';
import './page.scss';
import LandingPage from '@/components/landing-page/LandingPage';
import { landingPage } from '@/seo/LandingPage';

const URL_DOMAIN_APP = process.env.NEXT_PUBLIC_REACT_APP_DOMAIN;

export const metadata = {
  openGraph: {
    title: 'Letsmetrix',
    description: `${landingPage.description}`,
    url: `${URL_DOMAIN_APP}`,
    siteName: 'Letsmetrix',
    images: [
      {
        url: 'https://letsmetrix.com/_next/image?url=%2Fimage%2Flogo_update.webp&w=96&q=75',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function Home() {
  return (
    <NavbarPage>
      <LandingPage />
    </NavbarPage>
  );
}
