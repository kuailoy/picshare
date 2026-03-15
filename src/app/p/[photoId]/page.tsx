import { Metadata } from 'next'
import Carousel from '@/components/Carousel'
import getResults from '@/utils/cachedImages'
import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'
import type { GalleryImage } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ photoId: string }>
}): Promise<Metadata> {
  const { photoId } = await params
  const results = await getResults()
  const currentPhotoPublicId = results.resources[Number(photoId)]?.public_id
  const currentPhotoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_2560/${currentPhotoPublicId}`

  return {
    title: 'Next.js Conf 2022 Photos',
    openGraph: { images: [currentPhotoUrl] },
    twitter: { images: [currentPhotoUrl] },
  }
}

export default async function PhotoPage({
  params,
}: {
  params: Promise<{ photoId: string }>
}) {
  const { photoId } = await params
  const results = await getResults()

  let reducedResults: GalleryImage[] = []
  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    })
    i++
  }

  const currentPhoto = reducedResults.find(img => img.id === Number(photoId))
  if (currentPhoto) {
    currentPhoto.blurDataUrl = await getBase64ImageUrl(currentPhoto)
  }

  return (
    <main className="mx-auto max-w-[1960px] p-4">
      <Carousel currentPhoto={currentPhoto} index={Number(photoId)} />
    </main>
  )
}
