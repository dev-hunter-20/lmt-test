import Script from 'next/script';
import React from 'react';

export default function CrispChat() {
  return (
    <>
      <Script
        id="crisp-chat"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.$crisp = [];
            window.CRISP_WEBSITE_ID = 'e6fb67aa-d67d-46a4-8305-1c4b23d16979';

            (function () {
              const d = document;
              const s = d.createElement('script');
              s.src = 'https://client.crisp.chat/l.js';
              s.async = 1;
              d.getElementsByTagName('head')[0].appendChild(s);
            })();
          `,
        }}
      />
    </>
  );
}
