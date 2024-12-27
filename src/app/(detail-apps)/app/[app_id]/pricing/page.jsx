import NavbarPage from '@/layouts/main/NavbarPage';
import PricingContent from './_components/PricingContent';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { AppDetailPricings } from '@/seo/AppDetail';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const app_id = params.app_id;
  const cacheFileName = 'appPricing';
  let cachedMetadata = readCache(cacheFileName);

  if (cachedMetadata[app_id]) {
    const { metadata, timestamp } = cachedMetadata[app_id];
    if (!shouldUpdateMetadata(timestamp, 1)) {
      const { title, description, metaTitle, canonical } = metadata;
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
    } else {
      clearCache(cacheFileName);
    }
  }

  let title, description, metaTitle, canonical;
  let appName = '',
    appMetaTitle = '',
    appMetaDesc = '';

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail && appDetail.data && appDetail.data.detail) {
      appName = appDetail.data.detail.name || '';
      appMetaTitle = appDetail.data.detail.metatitle || '';
      appMetaDesc = appDetail.data.detail.metadesc || '';
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  if (AppDetailPricings) {
    const {
      title: getTitle,
      description: getDescription,
      metaTitle: getMetaTitle,
      canonical: getCanonical,
    } = AppDetailPricings;
    title = getTitle(appName, currentYear);
    description = getDescription(appName, appName);
    metaTitle = getMetaTitle(appName, currentYear);
    canonical = getCanonical(app_id);
  }

  const metadata = { title, description, metaTitle, canonical };

  cachedMetadata[app_id] = {
    metadata,
    timestamp: new Date().getTime(),
  };
  writeCache(cacheFileName, cachedMetadata);

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

export default function PricingPage() {
  return (
    <NavbarPage>
      <PricingContent />
    </NavbarPage>
  );
}
