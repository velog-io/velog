import { NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { path: string[] } }) {
  const path = params.path.join('/')
  const proxyUrl = `https://cache.velcdn.com/sitemap/${path}`

  try {
    const response = await fetch(proxyUrl, {
      headers: {
        'User-Agent': request.headers.get('user-agent') || '',
      },
    })

    if (!response.ok) {
      return new Response('Not Found', { status: 404 })
    }

    const data = await response.text()

    return new Response(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
      },
    })
  } catch (error) {
    console.error('Sitemap proxy error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}
