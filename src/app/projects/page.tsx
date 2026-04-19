import ProjectsClient from '@/components/ProjectsClient'
import { getProjects } from '@/server/data'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return <ProjectsClient initialProjects={projects} />
}
