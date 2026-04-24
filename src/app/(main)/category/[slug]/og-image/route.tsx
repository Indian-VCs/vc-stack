import { renderCategoryOgImage } from '@/lib/og-images'

export const revalidate = 3600

interface Context {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params
  return renderCategoryOgImage(slug)
}
