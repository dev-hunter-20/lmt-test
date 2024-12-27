import NavbarPage from '@/layouts/main/NavbarPage';
import CompareApp from './_components/CompareApp';
import { AppCompare } from '@/seo/AppDetail';
import CompareAppService from '@/api-services/api/CompareAppApiService';

export const generateMetadata = async ({ params }) => {
  const app_id = params.app_id;
  const compare_app_id = params.compare_app_id;

  let title, description, metaTitle, canonical;
  let appNameHost = '',
    appNameCompare = '';

  try {
    const response = await CompareAppService.compareApps(app_id, compare_app_id);
    const dataAppHost = response.data[0].app_host.app_name;
    const dataAppCompare = response.data[1].app_compare.map((appCompare) => appCompare.app_name).join(' vs ');
    if (dataAppHost && dataAppCompare) {
      appNameHost = dataAppHost || '';
      appNameCompare = dataAppCompare || '';
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  if (AppCompare) {
    const {
      title: getTitle,
      description: getDescription,
      metaTitle: getMetaTitle,
      canonical: getCanonical,
    } = AppCompare;
    title = getTitle(appNameHost, appNameCompare);
    description = getDescription(appNameHost, appNameCompare);
    metaTitle = getMetaTitle(appNameHost, appNameCompare);
    canonical = getCanonical(app_id, compare_app_id);
  }

  return {
    title: title || '',
    description: description || '',
    openGraph: {
      title: metaTitle || '',
      description: description || '',
    },
    alternates: {
      canonical: canonical || '',
    },
    other: {
      title: metaTitle || '',
    },
  };
};

export default function CompareAppId() {
  return (
    <NavbarPage>
      <CompareApp />
    </NavbarPage>
  );
}
