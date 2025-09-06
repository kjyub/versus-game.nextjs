import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/csstaff/'],
    },
    sitemap: 'https://versus-game.vercel.app/sitemap.xml',
  };
}
