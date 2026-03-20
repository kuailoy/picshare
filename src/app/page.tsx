import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'
import type { GalleryImage } from '@/types'
import Gallery from '@/components/Gallery'
import { getGalleryImages } from '@/server/data'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ photoId?: string }>
}) {
  const { photoId } = await searchParams

  const results = await getGalleryImages()
  const reducedResults: GalleryImage[] = [...results]

  const imagesWithBlurDataUrls = await Promise.all(
    reducedResults.map(async (image: GalleryImage) => ({
      ...image,
      blurDataUrl: await getBase64ImageUrl(image),
    })),
  )

  return <Gallery images={imagesWithBlurDataUrls} photoId={photoId} />
}
