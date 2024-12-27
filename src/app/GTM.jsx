'use client';

import Script from 'next/script';
import React, { useEffect, useState } from 'react';

export default function GTM() {
  const [isStaging, setIsStaging] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hostname === 'staging.letsmetrix.com') {
      setIsStaging(true);
    }
  }, []);

  useEffect(() => {
    const paramValue = window.localStorage.getItem('current-un-Key');
    if (paramValue && paramValue.length > 0) {
      const clarityInterval = setInterval(() => {
        if (typeof window.clarity === 'function') {
          window.clarity('set', 'userId', paramValue.toString());
          clearInterval(clarityInterval);
        }
      }, 100);
      return () => clearInterval(clarityInterval);
    }
  }, []);

  return (
    <>
      {isStaging && <meta name="robots" content="noindex, nofollow" />}
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-PQMXQ54L');
            `,
        }}
      />
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=AW-16742733927" />
      <Script
        id="ga-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-16742733927');
            `,
        }}
      />
      <Script
        id="microsoft-clarity"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "ongl9bmim3");
            `,
        }}
      />
    </>
  );
}
