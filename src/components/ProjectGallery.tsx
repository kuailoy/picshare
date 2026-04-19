import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'
import Gallery from '@/components/Gallery'
import type { GalleryImage } from '@/types'
import { getGalleryImages } from '@/server/data'

type ProjectGalleryProps = {
  photoId?: string
  folder: string
  projectSlug?: string
  basePath: string
  allowUpload: boolean
  title: string
  description?: string | null
  creditName?: string | null
  clientName?: string | null
}

export default async function ProjectGallery({
  photoId,
  folder,
  projectSlug,
  basePath,
  allowUpload,
  title,
  description,
  creditName,
  clientName,
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
      projectSlug={projectSlug}
      allowUpload={allowUpload}
      title={title}
      description={description || undefined}
      creditName={creditName || undefined}
      clientName={clientName || undefined}
    />
  )
}