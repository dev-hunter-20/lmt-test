import CategoriesApiService from '@/api-services/api/CategoriesApiService';
import CategoryCollectionDetail from '@/components/category-collection/CategoryCollectionDetail';
import NavbarPage from '@/layouts/main/NavbarPage';
import { categories } from '@/seo/AppDashboard';
import { clearCache, readCache, shouldUpdateMetadata, writeCache } from '@/utils/CacheMetaData';

export const generateMetadata = async ({ params }) => {
  const currentYear = new Date().getFullYear();
  const slug = params.slug;
  const cacheFileName = 'categories';
  let cachedMetadata = readCache(cacheFileName);

  if (cachedMetadata[slug]) {
    const { metadata, timestamp } = cachedMetadata[slug];
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
    const categoryData = await CategoriesApiService.getConversationCategory(
      slug,
      'best_match',
      1,
      20,
      'uk',
      'rank',
      'all',
      0,
      0,
    );

    if (categoryData.code === 0) {
      const { title, description, metaTitle, canonical } = categories;

      const metadata = {
        title: title(categoryData.data.text, currentYear),
        description: description(categoryData.data.text),
        metaTitle: metaTitle(categoryData.data.text),
        canonical: canonical(slug),
      };

      cachedMetadata[slug] = {
        metadata,
        timestamp: new Date().getTime(),
      };
      writeCache(cacheFileName, cachedMetadata);

      return {
        title: title(categoryData.data.text, currentYear),
        description: description(categoryData.data.text),
        openGraph: {
          title: metaTitle(categoryData.data.text),
          description: description(categoryData.data.text),
        },
        alternates: {
          canonical: canonical(slug),
        },
        other: {
          title: metaTitle(categoryData.data.text) || '',
        },
      };
    }
  } catch (error) {
    console.error('Error fetching categories detail:', error);
  }

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
};

export default function Category() {
  return (
    <NavbarPage>
      <CategoryCollectionDetail />
    </NavbarPage>
  );
}
