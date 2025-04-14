import type { APIRoute } from 'astro'
import { getImage } from 'astro:assets'
import favicon from '../images/favicon.png'

const faviconPngSizes = [192, 512]

export const GET: APIRoute = async () => {
  const icons = await Promise.all(
    faviconPngSizes.map(async (size) => {
      const image = await getImage({
        src: favicon,
        width: size,
        height: size,
        format: 'png'
      })
      return {
        src: image.src,
        type: `image/${image.options.format}`,
        sizes: `${image.options.width}x${image.options.height}`
      }
    })
  )

  const manifest = {
    name: 'Bruno Arueira | Software Engineer',
    description: 'Bruno Arueira is a software engineer, lately working mostly with ruby, rails, nodejs and react. Besides that, he also knows a bit about DevOps.',
    start_url: '/',
    display: 'standalone',
    id: 'bruno-arueira',
    icons
  }

  return new Response(JSON.stringify(manifest))
}
