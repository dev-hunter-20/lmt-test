'use client';

import { useState, useEffect } from 'react';
import { Col, Row, Spin, Breadcrumb, Carousel, Typography, message } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import './BlogDetail.scss';
import BlogsApiService from '@/api-services/api/BlogsApiService';
import ItemSlider from './item-slider/ItemSlider';
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';

function BlogDetail() {
  const [blogDetail, setBlogDetail] = useState({
    title: '',
    date: '',
    content: '',
    author: '',
    imgUrl: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const parts = pathname.split('/');
  const lastPart = parts[parts.length - 1];
  const slug = lastPart;
  const [recentBlogs, setRecentBlogs] = useState([]);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  useEffect(() => {
    fetchBlogDetail(slug);
  }, []);

  const fetchBlogDetail = async (slug) => {
    setIsLoading(true);
    try {
      const [blog, recentBlogsResult] = await Promise.all([
        BlogsApiService.getBlogDetail(slug),
        BlogsApiService.getAllBlogs(1, 20),
      ]);

      if (blog) {
        setBlogDetail({
          title: blog.data.title,
          date: blog.data.createdAt,
          content: blog.data.content,
          author: blog.data.author,
          imgUrl: blog.data.img,
        });
      }

      if (recentBlogsResult && recentBlogsResult.code == 0) {
        let sortedBlogs = recentBlogsResult.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentBlogs(shuffleArray(sortedBlogs).slice(0, 5));
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const customDiv = (html) => <div dangerouslySetInnerHTML={{ __html: html }}></div>;
  const myDate = new Date(blogDetail.date);

  // Hàm để shuffle array
  const shuffleArray = (array) => {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  return (
    <Spin spinning={isLoading}>
      <div className="breadcrumb-header">
        <div className="container">
          <Breadcrumb>
            <Breadcrumb.Item style={{ color: 'white' }}>
              <ArrowLeftOutlined onClick={handleBack} style={{ cursor: 'pointer', marginRight: '8px' }} />
              {blogDetail.title}
            </Breadcrumb.Item>
          </Breadcrumb>
        </div>
      </div>
      <div className="container-blog">
        <Row type="flex" style={{ alignItems: 'center', marginTop: '20px' }}>
          <Col lg={24} span={24}>
            <h1>{blogDetail.title}</h1>
            <div className="blog-meta">
              <i>Author:</i> <strong>{blogDetail.author}</strong> | <i>Created Date:</i>{' '}
              {myDate.toLocaleDateString('en-GB')}
            </div>
            <div className="blog-content">{customDiv(blogDetail.content)}</div>
          </Col>
        </Row>
      </div>
      <div className="widget-area container">
        <Typography.Title level={2} className="primary-color">
          Recent Posts
        </Typography.Title>
        <div className="carousel-container">
          <Carousel
            infinite
            arrows
            dots={false}
            slidesToShow={4}
            slidesToScroll={1}
            autoplay
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 1,
                },
              },
            ]}
          >
            {recentBlogs.map((blog) => (
              <div key={blog.slug}>
                <ItemSlider blog={blog} />
              </div>
            ))}
          </Carousel>
        </div>
      </div>
    </Spin>
  );
}
export default BlogDetail;
