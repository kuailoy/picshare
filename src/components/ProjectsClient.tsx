'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ProjectPlaceholder from '@/components/ProjectPlaceholder'
import NewProjectModal from '@/app/projects/NewProjectModal'
import type { ProjectListItem } from '@/types'

type ProjectsClientProps = {
  initialProjects: ProjectListItem[]
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

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const router = useRouter()
  const [projects, setProjects] = useState(initialProjects)
  const [isOpen, setIsOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [creditName, setCreditName] = useState('')
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(false)

  function closeModal() {
    setIsOpen(false)
    setProjectName('')
    setCreditName('')
    setClientName('')
  }

  async function createProject() {
    const name = projectName.trim()
    const credit = creditName.trim()
    const client = clientName.trim()

    if (!name || loading) return

    setLoading(true)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          creditName: credit || undefined,
          clientName: client || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.error || 'Failed to create project')
        return
      }

      setProjects((currentProjects) => [
        {
          id: data.id,
          slug: data.slug,
          name: data.name,
          description: data.description,
          folder: data.folder,
          coverImageUrl: null,
        },
        ...currentProjects,
      ])
      closeModal()
      router.push(`/projects/${data.slug}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <NewProjectCard onClick={() => setIsOpen(true)} />

          {projects.map((project) => {
            const coverUrl = project.coverImageUrl ?? '/placeholder.jpg'

            return (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
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
      </main>

      {isOpen && (
        <NewProjectModal
          projectName={projectName}
          creditName={creditName}
          clientName={clientName}
          loading={loading}
          onProjectNameChange={setProjectName}
          onCreditNameChange={setCreditName}
          onClientNameChange={setClientName}
          onSubmit={createProject}
          onClose={closeModal}
        />
      )}
    </>
  )
}