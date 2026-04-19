import { notFound } from 'next/navigation'
import ProjectPage from '@/components/ProjectPage'
import { getProjectByShareToken } from '@/server/data'

export default async function SharePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>
  searchParams: Promise<{ photoId?: string }>
}) {
  const [{ token }, { photoId }] = await Promise.all([params, searchParams])
  const project = await getProjectByShareToken(token)

  if (!project) {
    notFound()
  }

  return (
    <ProjectPage
      project={project}
      canEdit={false}
      photoId={photoId}
      basePath={`/share/${token}`}
    />
  )
}