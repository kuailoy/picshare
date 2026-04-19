import { notFound } from 'next/navigation'
import ProjectGallery from '@/components/ProjectGallery'
import { getProjectByShareToken } from '@/server/data'

type ProjectCreditFields = {
  creditName?: string | null
  clientName?: string | null
}

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

  const projectWithCredits = project as typeof project & ProjectCreditFields

  return (
    <ProjectGallery
      photoId={photoId}
      folder={project.folder}
      basePath={`/share/${token}`}
      allowUpload={false}
      title={project.name}
      description={project.description}
      creditName={projectWithCredits.creditName ?? undefined}
      clientName={projectWithCredits.clientName ?? undefined}
    />
  )
}