import NavbarPage from '@/layouts/main/NavbarPage';
import ListBlogs from './_components/Blogs';
import { BlogDetail } from '@/seo/Blogs';
import { landingPage } from '@/seo/LandingPage';

const { canonical } = landingPage;
const { title } = BlogDetail;

export const metadata = {
  title: title,
  alternates: {
    canonical: `${canonical}blogs`,
  },
};

export default function Blogs() {
  return (
    <NavbarPage>
      <ListBlogs />
    </NavbarPage>
  );
}
