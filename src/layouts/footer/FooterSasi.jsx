'use client';

import { MailOutlined } from '@ant-design/icons';
import { Col, Layout, Row, Typography } from 'antd';
import Image from 'next/image';
import './FooterSasi.scss';
import { linkUnderline, menuLinks } from '@/constants/MenuItem';
import Link from 'next/link';

const { Footer } = Layout;

const FooterSasi = () => {
  return (
    <Footer className="footer-content">
      <div className="footer-sasi container">
        <Row gutter={50} className="flex-width" justify="space-between">
          <Col lg={5} sm={8} xs={16}>
            <Row justify="center" className="image-footer">
              <Typography.Text>Copyright © 2024 Lets Metrix LTD</Typography.Text>
              <Image
                src="/image/footer-sasi.webp"
                style={{ marginTop: '10px' }}
                width={75}
                height={50}
                className="img-fluid"
                alt="Logo"
              />
            </Row>
          </Col>
          <Col lg={4} sm={12} xs={12} className="flex flex-col justify-start link-title">
            {menuLinks.map((item, index) => (
              <Link key={index} href={item.href} className={`link ${item.class} text-start`}>
                {item.title}
              </Link>
            ))}
          </Col>
          <Col lg={5} sm={8} xs={24}>
            <div className="footer-email">
              <MailOutlined className="footer-email-icon" />
              <span>
                <Link prefetch={false} href="mailto:contact@letsmetrix.com">
                  contact@letsmetrix.com
                </Link>
              </span>
            </div>
          </Col>
          {linkUnderline.map((item, index) => (
            <Col key={index} lg={3} sm={8} xs={8} className="footer-mobile">
              <Link prefetch={false} className="link__underline" href={item.href}>
                {item.title}
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    </Footer>
  );
};

export default FooterSasi;
