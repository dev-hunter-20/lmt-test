import Script from 'next/script';
import React from 'react';

const GoogleAnalytics = () => {
  return (
    <>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-W3WPY2DK7L" strategy="lazyOnload" />
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W3WPY2DK7L');
          `,
        }}
      />

      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-PQMXQ54L"
          height="0"
          width="0"
          style="display:none;visibility:hidden"
        />
      </noscript>
    </>
  );
};

export default GoogleAnalytics;
