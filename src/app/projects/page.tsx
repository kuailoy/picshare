'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProjectPlaceholder from '@/components/ProjectPlaceholder'
import NewProjectModal from './NewProjectModal'

type Project = {
  id: string
  name: string
  coverImage?: { url: string }
  images: { url: string }[]
}

function getProjectCover(project: Project) {
  return project.coverImage?.url ?? project.images[0]?.url ?? '/placeholder.jpg'
}

function NewProjectCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group block text-left focus:outline-none"
    >
      <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-neutral-200 bg-neutral-100 text-neutral-600 transition duration-200 group-hover:scale-105 group-hover:bg-neutral-50">
        <span className="text-4xl font-light leading-none">+</span>
        <span className="mt-3 text-sm font-medium">Create Project</span>
      </div>
      <h2 className="mt-2 truncate text-sm font-medium text-gray-900">
        Create Project
      </h2>
    </button>
  )
}

function ProjectsGrid({
  projects,
  onCreateProject,
}: {
  projects: Project[]
  onCreateProject: () => void
}) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <NewProjectCard onClick={onCreateProject} />

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
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [loading, setLoading] = useState(false)

  const projects: Project[] = []

  function closeModal() {
    setIsOpen(false)
    setProjectName('')
  }

  async function createProject() {
    const name = projectName.trim()

    if (!name || loading) return

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to create project')
        return
      }

      closeModal()
      router.push(`/projects/${data.id}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ProjectsGrid
        projects={projects}
        onCreateProject={() => setIsOpen(true)}
      />

      {isOpen && (
        <NewProjectModal
          projectName={projectName}
          loading={loading}
          onProjectNameChange={setProjectName}
          onSubmit={createProject}
          onClose={closeModal}
        />
      )}
    </main>
  )
}
