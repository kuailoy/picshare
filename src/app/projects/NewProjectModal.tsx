'use client'

import { useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type NewProjectModalProps = {
  projectName: string
  loading: boolean
  onProjectNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function NewProjectModal({
  projectName,
  loading,
  onProjectNameChange,
  onSubmit,
  onClose,
}: NewProjectModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <form
        className="relative w-full max-w-sm rounded-lg bg-white p-6 shadow-lg"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close modal"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>

        <h2 className="pr-8 text-lg font-semibold text-gray-900">
          New Project
        </h2>

        <input
          value={projectName}
          onChange={(e) => onProjectNameChange(e.target.value)}
          placeholder="Project name"
          autoFocus
          className="mt-3 w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-neutral-400"
        />

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={loading || !projectName.trim()}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}