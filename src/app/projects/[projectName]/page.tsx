import { notFound } from 'next/navigation'
import ProjectGallery from '@/components/ProjectGallery'
import { getProjectBySlug } from '@/server/data'

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectName: string }>
  searchParams: Promise<{ photoId?: string }>
}) {
  const [{ projectName }, { photoId }] = await Promise.all([params, searchParams])
  const project = await getProjectBySlug(projectName)

  if (!project) {
    notFound()
  }

  return (
    <ProjectGallery
      photoId={photoId}
      folder={project.folder}
      basePath={`/projects/${project.slug}`}
      allowUpload={true}
      title={project.name}
      description={project.description}
    />
  )
}