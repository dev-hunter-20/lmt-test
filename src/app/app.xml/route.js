import { fetchData } from '@/utils/functions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const currentDate = new Date().toISOString();
    const apps = await fetchData(`https://newbe.letsmetrix.com/app/get_all_apps`);

    const urls = [
      ...apps.data.map((item) => ({
        loc: `https://letsmetrix.com/app/${item.app_id}`,
        lastmod: currentDate,
      })),
      ...apps.data.map((item) => ({
        loc: `https://letsmetrix.com/app/${item.app_id}/reviews`,
        lastmod: currentDate,
      })),
    ];

    let sitemapXmlApp = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
      xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    urls.forEach((url) => {
      sitemapXmlApp += `
        <url>
          <loc>${url.loc}</loc>
          <changefreq>weekly</changefreq>
          <lastmod>${url.lastmod}</lastmod>
          <priority>0.8</priority>
        </url>`;
    });

    sitemapXmlApp += `
      </urlset>`;

    return new NextResponse(sitemapXmlApp, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=2592000',
      },
    });
  } catch (e) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
