import { Card, Tag } from 'antd';
import './ItemSlider.scss';
import Image from 'next/image';
import Link from 'next/link';

const { Meta } = Card;

function ItemSlider(props) {
  const blog = props.blog;

  const renderTitle = (author, title, date, slug) => {
    return (
      <div className="item-title">
        <div className="item-title-author">
          Author: {author} - {date}
        </div>
        <Link prefetch={false} href={`/blogs/${slug}`} className="item-title-link">
          <div className="item-title-content">{title}</div>
        </Link>
      </div>
    );
  };

  const renderDescription = (desc, tags) => {
    return (
      <div className="item-desc">
        <div className="item-desc-content">{desc}</div>
        <div className="item-desc-tag">
          {tags.map((item, index) => (
            <Tag key={index}>{item}</Tag>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="item-slider">
      <Card cover={<Image alt="example" src={`https://api-wix.letsmetrix.com` + blog.imagePath} height={200} width={200} />} className="card-blog">
        <Meta
          title={renderTitle(blog.author, blog.title, (new Date(blog.createdAt)).toLocaleDateString('en-GB'), blog.slug)}
          description={renderDescription(blog.desc, blog.tags)}
        />
      </Card>
    </div>
  );
}

export default ItemSlider;
