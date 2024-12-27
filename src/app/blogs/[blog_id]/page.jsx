import NavbarPage from '@/layouts/main/NavbarPage';
import BlogDetail from './_components/BlogDetail';
import { BlogID } from '@/seo/Blogs';
import BlogsApiService from '@/api-services/api/BlogsApiService';

export async function generateMetadata({ params }) {
  const blog_id = params.blog_id;
  const blogID = await BlogsApiService.getBlogDetail(blog_id);

  const { title, canonical } = BlogID;
  const name = blogID.data.title;

  return {
    title: title(name),
    alternates: {
      canonical: canonical(blog_id),
    },
  };
}

export default function DetailBlog() {
  return (
    <NavbarPage>
      <BlogDetail />
    </NavbarPage>
  );
}
