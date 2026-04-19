import Link from 'next/link'
import ProjectPlaceholder from '@/components/ProjectPlaceholder'

type Project = {
  id: string
  name: string
  coverImage?: { url: string }
  images: { url: string }[]
}

type ProjectsGridProps = {
  projects: Project[]
}

export function getProjectCover(project: Project) {
  return project.coverImage?.url ?? project.images[0]?.url ?? '/placeholder.jpg'
}

function NewProjectCard() {
  return (
    <Link href="/projects/new" className="group block focus:outline-none">
      <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-600 transition duration-200 group-hover:scale-[1.02] group-hover:bg-neutral-50">
        <span className="text-4xl font-light leading-none">+</span>
        <span className="mt-3 text-sm font-medium">New Project</span>
      </div>
      <h2 className="mt-2 truncate text-sm font-medium text-gray-900">
        New Project
      </h2>
    </Link>
  )
}

function ProjectsGrid({ projects }: ProjectsGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <NewProjectCard />
      {projects.map((project) => {
        const coverUrl = getProjectCover(project)

        return (
          <Link
            key={project.id}
            href={`/projects/${project.id}`}
            className="group block focus:outline-none"
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 transition duration-200 group-hover:scale-105 group-hover:opacity-90">
              {coverUrl === '/placeholder.jpg' ? (
                <ProjectPlaceholder />
              ) : (
                <img
                  src={coverUrl}
                  alt={project.name}
                  className="h-full w-full object-cover"
                />
              )}
            </div>
            <h2 className="mt-2 truncate text-sm font-medium text-gray-900">
              {project.name}
            </h2>
          </Link>
        )
      })}
    </div>
  )
}

export default function ProjectsPage() {
  const projects: Project[] = []

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProjectsGrid projects={projects} />
    </main>
  )
}
