import Gallery from '@/components/Gallery'
import type { GalleryImage, ProjectDetail } from '@/types'
import { getGalleryImages } from '@/server/data'
import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'

type ProjectPageProps = {
  project: ProjectDetail
  canEdit: boolean
  photoId?: string
  basePath: string
}

export default async function ProjectPage({
  project,
  canEdit,
  photoId,
  basePath,
}: ProjectPageProps) {
  const results = await getGalleryImages(project.folder)
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
      folder={project.folder}
      projectSlug={canEdit ? project.slug : undefined}
      allowUpload={canEdit}
      title={project.name}
      description={project.description || undefined}
      creditName={project.creditName || undefined}
      clientName={project.clientName || undefined}
    />
  )
}