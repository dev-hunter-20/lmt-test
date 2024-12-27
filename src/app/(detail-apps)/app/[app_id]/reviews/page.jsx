import NavbarPage from '@/layouts/main/NavbarPage';
import ReviewApp from '../_components/review/ReviewApp';
import DetailAppApiService from '@/api-services/api/DetaiAppApiService';
import { AppDetailReviews } from '@/seo/AppDetail';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export const generateMetadata = async ({ params }) => {
  const app_id = params.app_id;
  const cacheFileName = 'appReviews';
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

  try {
    const appDetail = await DetailAppApiService.getAppInfo(app_id);
    const { title, description, metaTitle, canonical } = AppDetailReviews;
    const appName = appDetail.data.detail.name;

    const metadata = {
      title: title(appName),
      description: description(appName),
      metaTitle: metaTitle(appName),
      canonical: canonical(app_id),
    };

    cachedMetadata[app_id] = {
      metadata,
      timestamp: new Date().getTime(),
    };
    writeCache(cacheFileName, cachedMetadata);

    return {
      title: metadata.title || '',
      description: metadata.description || '',
      openGraph: {
        title: metadata.metaTitle || '',
        description: metadata.description || '',
      },
      alternates: {
        canonical: metadata.canonical || '',
      },
      other: {
        title: metadata.metaTitle || '',
      },
    };
  } catch (error) {
    console.error('Error fetching app_reviews detail:', error);
    return {
      title: '',
      description: '',
      openGraph: {
        title: '',
        description: '',
      },
      alternates: {
        canonical: '',
      },
      other: {
        title: '',
      },
    };
  }
};

export default function Reviews() {
  return (
    <NavbarPage>
      <ReviewApp />
    </NavbarPage>
  );
}
