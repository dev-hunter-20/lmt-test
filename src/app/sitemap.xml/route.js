import { DOMAIN } from '@/constants/ApiUrl';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const sitemapFiles = [
      { filename: 'category.xml', lastmod: currentDate },
      { filename: 'collection.xml', lastmod: currentDate },
      { filename: 'app.xml', lastmod: currentDate },
      { filename: 'developer.xml', lastmod: currentDate },
      { filename: 'blog.xml', lastmod: currentDate },
      { filename: 'app-pricing.xml', lastmod: currentDate },
    ];

    let sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
      <sitemapindex xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    sitemapFiles.forEach((sitemap) => {
      sitemapIndexXml += `
        <sitemap>
          <loc>${DOMAIN}${sitemap.filename}</loc>
          <lastmod>${sitemap.lastmod}</lastmod>
        </sitemap>`;
    });

    sitemapIndexXml += `
      </sitemapindex>`;

    return new NextResponse(sitemapIndexXml, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    console.error(e);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
