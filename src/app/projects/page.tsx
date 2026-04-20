import ProjectsClient from '@/components/ProjectsClient'
import { authOptions } from '@/auth'
import { getProjects } from '@/server/data'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function ProjectsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login?callbackUrl=/projects')
  }

  const projects = await getProjects()

  return <ProjectsClient initialProjects={projects} />
}
