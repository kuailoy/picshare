import { notFound } from 'next/navigation'
import SharedProjectPage from '@/components/ProjectPage'
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
    <SharedProjectPage
      project={project}
      canEdit={true}
      photoId={photoId}
      basePath={`/projects/${project.slug}`}
    />
  )
}