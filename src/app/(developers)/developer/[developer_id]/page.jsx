import NavbarPage from '@/layouts/main/NavbarPage';
import DeveloperDetail from './_components/DeveloperDetail';
import DashboardDeveloperApiService from '@/api-services/api/DashboardDeveloperApiService';
import { DeveloperBySlug } from '@/seo/Developer';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export async function generateMetadata({ params }) {
  const currentYear = new Date().getFullYear();
  const developer_id = params.developer_id;
  const cacheFileName = 'developers';
  let cachedMetadata = readCache(cacheFileName);

  if (cachedMetadata[developer_id]) {
    const { metadata, timestamp } = cachedMetadata[developer_id];
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
    const developerSlug = await DashboardDeveloperApiService.getDetailDeveloper(developer_id);
    const { title, description, metaTitle, metaDesc, canonical } = DeveloperBySlug;
    const name = developerSlug.data.name;

    const metadata = {
      title: title(name),
      description: description(name),
      metaTitle: metaTitle(name, currentYear),
      canonical: canonical(developer_id),
    };

    cachedMetadata[developer_id] = {
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
    console.error('Error fetching developer detail:', error);
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
}

export default function DetailDeveloper() {
  return (
    <NavbarPage>
      <DeveloperDetail />
    </NavbarPage>
  );
}
