import ApiUtils from '@/utils/ApiUtils'
import { MetadataRoute } from 'next'

// /product/sitemap/1.xml
// export async function generateSitemaps() {
//     // Fetch the total number of products and calculate the number of sitemaps needed
//     return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
// }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [bResult, statusCode, response] = await ApiUtils.request(`/api/versus/game/ids`, 'GET')

  const gameIds: Array<string> = response as string[]

  let siteMaps = [
    {
      url: 'https://chooseming.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ]

  for (const gameId of gameIds) {
    siteMaps.push({
      url: `https://chooseming.com/game/${gameId}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    })
  }

  return siteMaps
}
