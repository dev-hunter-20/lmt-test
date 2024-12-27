import NavbarPage from '@/layouts/main/NavbarPage';
import { Col, Row } from 'antd';
import Image from 'next/image';
import './page.scss';
import Link from 'next/link';

export default function AboutUs() {
  return (
    <NavbarPage>
      <div className={'about-us container'}>
        <Row>
          <Col lg={24} span={24}>
            <main id="content" role={'main'}>
              <div style={{ clear: 'both' }}>
                <div id="system-message-container">
                  <div className="item-page" itemScope itemType={'http://schema.org/Article'}>
                    <meta itemProp={'inLanguage'} content={'en-GB'} />
                    <div className="page-header">
                      <Link prefetch={false} href={'/about-us'} itemProp={'url'}>
                        <h1>About Us - Letmetrix</h1>
                      </Link>
                    </div>
                    <div className="container-content" itemProp={'articleBody'}>
                      <p className="text">
                        “We’re passionate to craft numerous apps for marketers around the world to become more effective
                        at work and to make everything count”
                      </p>
                      <h2 id="pp-general">From Insights to Impact</h2>
                      <p>
                        Welcome to Letmetrix, where innovation meets precision in the Shopify ecosystem. As a team of
                        developers with over 11 years of experience creating Shopify apps, we experienced first-hand the
                        challenges that app developers face. Our mission is clear: to streamline the optimization
                        process and make it an effortless part of your journey.
                      </p>
                      <h2 id="pp-general">What We Do</h2>
                      <p>
                        At Letmetrix, we empower Shopify app developers with precise analytics tools that provide deep
                        insights into ASO (App Store Optimization), app performance, and user engagement. Our platform
                        is designed to help you make informed decisions, allowing for the effective optimization of your
                        strategies and enhancing the success of your app on Shopify.
                      </p>
                      <span>With Letmetrix, you're equipped to not only meet but exceed your strategic goals.</span>
                      <h2 className="custom-solution" id="pp-general">
                        Custom Solutions
                      </h2>
                      <p>
                        We recognize that each app developer has unique needs. If our existing tools do not perfectly
                        align with what you're looking for, our custom solutions are the perfect answer. We offer
                        personalized services where our team collaborates with you to create tailored analytics
                        solutions hosted directly on your server. Start your journey towards optimized app performance
                        today. For bespoke solutions and queries, reach out to us at contact@letmetrix.com. Letmetrix is
                        here to decode the complexities of Shopify and guide you towards achieving measurable success.
                      </p>
                      <span>Join us at Letmetrix, where your app’s potential is limitless.</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </Col>
        </Row>
        <Row type="flex" style={{ alignItems: 'center', marginTop: '20px' }}>
          <Col lg={12} span={24}>
            <div className={'image-container'}>
              <Image
                src={'/image/feature.webp'}
                width={700}
                height={500}
                alt={'feature'}
                objectFit="cover"
                className={'image'}
              />
            </div>
          </Col>
          <Col lg={12} span={24}>
            <div className={'image-container'}>
              <Image
                src={'/image/feature2.webp'}
                width={700}
                height={500}
                alt={'feature'}
                objectFit="cover"
                className={'image'}
              />
            </div>
          </Col>
        </Row>
      </div>
    </NavbarPage>
  );
}
