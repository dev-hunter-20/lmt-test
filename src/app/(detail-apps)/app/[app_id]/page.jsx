import NavbarPage from '@/layouts/main/NavbarPage';
import DetailAppPage from './_components/detail-app/DetailAppPage';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { AppDetail } from '@/seo/AppDetail';
import Script from 'next/script';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const app_id = params.app_id;
  const cacheFileName = 'appDetails';
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

  if (AppDetail) {
    const {
      title: getTitle,
      description: getDescription,
      metaTitle: getMetaTitle,
      canonical: getCanonical,
    } = AppDetail;
    title = getTitle(appName, currentYear);
    description = getDescription(appName, appMetaDesc);
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

export default async function DetailApp({ params }) {
  const app_id = params.app_id;
  let star = 0,
    reviewCount = 0,
    appIcon = '',
    desc = '',
    name = '';
  let jsonLd = null;

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    if (appDetail && appDetail.data && appDetail.data.detail) {
      star = appDetail.data.detail.star || 0;
      reviewCount = appDetail.data.detail.review_count || 0;
      appIcon = appDetail.data.detail.app_icon || '';
      desc = appDetail.data.detail.description || '';
      name = appDetail.data.detail.name || '';

      if (reviewCount > 0) {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${name}`,
          url: `https://letsmetrix.com/app/${app_id}`,
          description: `${desc}`,
          image: `${appIcon}`,
          aggregateRating: {
            '@type': 'AggregateRating',
            worstRating: '1',
            bestRating: '5',
            ratingValue: `${star}`,
            reviewCount: `${reviewCount}`,
          },
        };
      } else {
        jsonLd = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: `${name}`,
          url: `https://letsmetrix.com/app/${app_id}`,
          description: `${desc}`,
          image: `${appIcon}`,
        };
      }
    }
  } catch (error) {
    console.error('Error fetching app detail:', error);
  }

  return (
    <>
      <NavbarPage>
        <DetailAppPage />
      </NavbarPage>
      {jsonLd && (
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          strategy="lazyOnload"
          id={app_id}
        />
      )}
    </>
  );
}
