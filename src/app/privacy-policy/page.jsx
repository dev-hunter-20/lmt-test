import NavbarPage from '@/layouts/main/NavbarPage';
import './page.scss';
import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <NavbarPage>
      <div className="privacy-policy container">
        <main id="content" role="main">
          <div style={{ clear: 'both' }} />
          <div id="system-message-container"></div>
          <div className="item-page" itemScope itemType="http://schema.org/Article">
            <meta itemProp="inLanguage" content="en-GB" />
            <div className="page-header">
              <Link prefetch={false} href={'/privacy-policy'} itemProp="url">
                <h1 itemProp="name"> Privacy Policy </h1>
              </Link>
            </div>
            <div className="articleBody" itemProp="articleBody">
              <p>
                This Privacy Policy will help you better understand how Omegatheme (we) collect, use, and process your
                personal information through our website https://sasi.work/. If we change our privacy practices, we may
                update this privacy policy.
                <br />
                We do not collect information from individuals under the age of 13. If you are under the age of 13, we
                ask that you do not provide any personal information through this site. If we have specific knowledge
                that an individual under the age of 13 has submitted personally identifiable information to this site,
                we will remove such information without any notification.
                <br />
                If you do not agree to be bound by this Privacy Policy, do not provide any personal data to us.
              </p>
              <h2 id="pp-general">How you can reach us</h2>
              <p>
                If you would like to ask about, make a request relating to, or complain about how we process your
                personal information, please contact{' '}
                <Link prefetch={false} href={'https://www.facebook.com/OmegaTheme/'} target="_blank" rel="noreferrer">
                  OmegaTheme support
                </Link>
                , or mail us at{' '}
                <Link prefetch={false} href={'mailto:contact@letsmetrix.com'}>
                  contact@letsmetrix.com
                </Link>
                <br />
                OmegaTheme
                <br />
                8th floor, Hoa Cuong Building 18/11 Thai Ha, Dong Da Dist, Hanoi <br />
                Head: No. 3, 175/55 Lane, Lac Long Quan St., Nghia Do Ward, Cau Giay District, Hanoi City, Vietnam
              </p>
              <h2 id="pp-info-collection-use">What information we collect about you</h2>
              <h3>Personal information</h3>
              <p>
                When you visit the Site, we automatically collect certain information about your device, including
                information about your web browser, IP address, time zone, and some of the cookies that are installed on
                your device. Information about how you access the website, your account, email address, your profile
                picture, language preferences. By signing up for Google Analytics, you agree that Omegatheme can see and
                download your Google Analytics data to sync in your account on Sasi.work. We just pull the Google
                Analytics data as is without editing or attaching them to any sources that render the data identifiable
                to anyone, other than the corresponding authorized user of the Google Analytics account themselves.
                <br />
                Additionally, as you browse the Site, we collect information about the individual web pages or products
                that you view, what websites or search terms referred you to the Site, and information about how you
                interact with the Site. We refer to this automatically-collected information as “Device Information.”
              </p>
              <h3>Credit Card Information</h3>
              <p>
                If you use a credit card to purchase an account via this site, your name as it appears on the credit
                card, the credit card number, expiration date, and billing address will be encrypted as it passes over
                the Internet. Omegatheme does not record or keep your credit card information for online credit-card
                transactions; rather such information is simply passed through to our contracted payment processing
                vendor (PayPal, MoneyBookers, etc.). Omegatheme may access such information through the payment
                processing company, but does not do so except to process refunds or adjustments and to the extent
                necessary in the event of nonpayment or disputed payments, or as may be necessary for Omegatheme'
                compliance, in Omegatheme' discretion, with applicable law.
              </p>
              <h3>Information for Technical Support</h3>
              <p>
                When we get your request for online technical support, we will ask you for the necessary information to
                complete the transaction such as your name, email address, and information about your computer hardware,
                software, hosting, and the nature of the problem you are experiencing. Such transmissions and storing of
                your data are secure.
              </p>
              <h2 id="pp-security-your-info">How we collect the information</h2>
              <p>We collect Device Information using the following technologies:</p>
              <h2 id="pp-site-functionality">4. Site Functionality</h2>
              <h3>Cookies</h3>
              <p>
                A "cookie" is a piece of data stored on the user's hard drive containing information about the user.
                Usage of a cookie is in no way linked to any personally identifiable information while on our Site. Once
                you close your browser, the cookie simply terminates. For instance, by setting a cookie on our Site, you
                would not have to log in a password more than once, thereby saving time while on our Site. You may still
                use our Site if you reject the cookie. The only drawback to this is that you will be limited in some
                areas of our Site. For example, you will not be able to use certain features of our forum or other parts
                of the Site that offer customized settings.
              </p>
              <h3>Log Files</h3>
              <p>
                We (Omegatheme and/or our contracted web analytics provider(s)) do keep track of the domains from which
                you access our Site and Services on the World Wide Web, and may log IP addresses or other identifiers
                for statistical purposes. We do this to gather broad demographic information for aggregate use to
                identify and analyze trends and the results of our marketing efforts, to help diagnose problems with our
                servers and to administer the Site and Services, and analyze users' movements. We may periodically share
                aggregated demographic information with our business partners. IP addresses and other identifiers are
                not linked to personally identifiable information.
              </p>
              <h3>Links to other websites</h3>
              <p>
                This Site contains links to other sites. Please be aware that we, Omegatheme, are not responsible for
                the privacy practices of such other sites. We encourage you to be aware when you leave our Site and to
                read the privacy statements of each website that collects personally identifiable information. This
                privacy statement applies solely to information collected by this Site.
              </p>
              <h2 id="pp-how-we-contact">How we use your information</h2>
              <p>
                We share Personal Information to comply with applicable laws and regulations, to respond to a subpoena,
                search warrant or other lawful request for information we receive, or to otherwise protect our rights.
                In addition, we share your information with service providers who provide IT and system administration
                services.
                <br />
                We also use your Personal Information to provide you with targeted advertisements or marketing
                communications we believe may be of interest to you, also to provide you with the use of our tool and
                other related services (e.g., to confirm your identity, to contact you about issues with the tool).
                Before we share your personal data with any third party for their own marketing purposes we will get
                your express consent.
                <br />
                If you want to opt out of receiving marketing communications, you can contact us at{' '}
                <Link prefetch={false} href="mailto:contact@letsmetrix">
                  contact@letsmetrix.com{' '}
                </Link>
                at any time, but be noted that this opt-out action does not apply to personal data provided as a result
                of other transactions such as complete a payment, etc.
              </p>
              <h2 id="pp-change-your-info">Security of Your Information</h2>
              <p>
                We are committed to ensuring that all your information is secure. We also allow access to your personal
                data only to those employees and partners who have a business need to know such data. They will only
                process your personal data on our instructions and they must keep it confidential.
                <br />
                The Site is regularly tested for security breaches to ensure that all information collected is secure
                from unauthorized viewing. Finally, we do not and will not “sell” your personal information.
              </p>
              <h2 id="pp-how-we-contact">Retention of Your Information</h2>
              <p>
                We generally keep your personal information while you use OmegaTheme service. If you cancel the
                subscription, you stop paying your subscription fees, we will only retain your personal data for as long
                as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any
                legal, accounting, or reporting requirements.
                <br />
                We don’t do this immediately in case you reactivate your account, or if there is a legal complaint or
                audit relating to your business. If you contact us to request deletion of your store’s information, we
                will begin the personal information purge process after 90 days, except if we are legally required to
                retain specific information. If you have questions about this process, please contact us at{' '}
                <Link prefetch={false} href={'mailto:contact@letsmetrix.com'}>
                  contact@letsmetrix.com
                </Link>
                . Please keep in mind that after we anonymize your personal information, we may continue to use
                non-identifiable information to improve our services.
              </p>
              <h2 id="pp-change-your-info">Last Updated</h2>
              <p>This privacy policy was last updated on: 27 August 2021</p>
              <p>&nbsp;</p>{' '}
            </div>
          </div>
        </main>
      </div>
    </NavbarPage>
  );
}
