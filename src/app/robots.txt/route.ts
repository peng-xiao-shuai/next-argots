import { NextResponse } from 'next/server';

export function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://argots.cn';

  const robotsTxt = `# *
User-agent: *
Allow: /

# Host
Host: ${siteUrl}

# Sitemaps
Sitemap: ${siteUrl}/sitemap.xml`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
