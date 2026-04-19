import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'
import Gallery from '@/components/Gallery'
import type { GalleryImage } from '@/types'
import { getGalleryImages } from '@/server/data'

type ProjectGalleryProps = {
  photoId?: string
  folder: string
  basePath: string
  allowUpload: boolean
  title: string
  description?: string | null
}

export default async function ProjectGallery({
  photoId,
  folder,
  basePath,
  allowUpload,
  title,
  description,
}: ProjectGalleryProps) {
  const results = await getGalleryImages(folder)
  const reducedResults: GalleryImage[] = [...results]

  const imagesWithBlurDataUrls = await Promise.all(
    reducedResults.map(async (image: GalleryImage) => ({
      ...image,
      blurDataUrl: await getBase64ImageUrl(image),
    })),
  )

  return (
    <Gallery
      images={imagesWithBlurDataUrls}
      photoId={photoId}
      basePath={basePath}
      folder={folder}
      allowUpload={allowUpload}
      title={title}
      description={description || undefined}
    />
  )
}