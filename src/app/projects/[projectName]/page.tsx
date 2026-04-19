import { notFound } from 'next/navigation'
import ProjectGallery from '@/components/ProjectGallery'
import { getProjectBySlug } from '@/server/data'

type ProjectCreditFields = {
  creditName?: string | null
  clientName?: string | null
}

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

  const projectWithCredits = project as typeof project & ProjectCreditFields

  return (
    <ProjectGallery
      photoId={photoId}
      folder={project.folder}
      projectSlug={project.slug}
      basePath={`/projects/${project.slug}`}
      allowUpload={true}
      title={project.name}
      description={project.description}
      creditName={projectWithCredits.creditName ?? undefined}
      clientName={projectWithCredits.clientName ?? undefined}
    />
  )
}