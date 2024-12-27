import './globals.scss';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import QueryProvider from './QueryProvider';
import { landingPage } from '@/seo/LandingPage';
import CrispChat from './CrispChat';
import GoogleAnalytics from './GoogleAnalytics';
import GTM from './GTM';
import AppProvider from './AppProvider';

const { canonical } = landingPage;

export const metadata = {
  title: `${landingPage.title}`,
  description: `${landingPage.description}`,
  alternates: {
    canonical: canonical,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <GTM />
      </head>
      <body>
        <QueryProvider>
          <AppProvider>
            <AntdRegistry>
              {children}
              <CrispChat />
              <GoogleAnalytics />
            </AntdRegistry>
          </AppProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
