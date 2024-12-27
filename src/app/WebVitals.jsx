'use client';

import { useEffect } from 'react';
import { useReportWebVitals } from 'next/web-vitals';

export function WebVitals() {
  useReportWebVitals((metric) => {
    switch (metric.name) {
      case 'LCP': // Largest Contentful Paint
        console.log('LCP:', metric.value);
        break;
      case 'FCP': // First Contentful Paint
        console.log('FCP:', metric.value);
        break;
      case 'CLS': // Cumulative Layout Shift
        console.log('CLS:', metric.value);
        break;
      case 'TTFB': // Time to First Byte
        console.log('TTFB:', metric.value);
        break;
      default:
        console.log(metric.name, metric.value);
    }
  });

  useEffect(() => {
    const scripts = document.querySelectorAll('script');
    scripts.forEach((script, index) => {
      console.log(`Script ${index + 1}:`, {
        src: script.src || 'inline script',
        async: script.async,
        defer: script.defer,
      });
    });
  }, []);

  return null;
}
