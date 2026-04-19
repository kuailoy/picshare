'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

type NewProjectModalProps = {
  projectName: string
  creditName: string
  clientName: string
  loading: boolean
  onProjectNameChange: (name: string) => void
  onCreditNameChange: (name: string) => void
  onClientNameChange: (name: string) => void
  onSubmit: () => void
  onClose: () => void
}

export default function NewProjectModal({
  projectName,
  creditName,
  clientName,
  loading,
  onProjectNameChange,
  onCreditNameChange,
  onClientNameChange,
  onSubmit,
  onClose,
}: NewProjectModalProps) {
  const [showOptional, setShowOptional] = useState(false)

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

        <div className="mt-4 rounded-md border border-neutral-200">
          <button
            type="button"
            onClick={() => setShowOptional((prev) => !prev)}
            className="flex w-full items-center justify-between px-3 py-2 text-left"
            aria-expanded={showOptional}
          >
            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
              Optional credits
            </span>
            <span className="text-xs text-gray-500">{showOptional ? 'Hide' : 'Add'}</span>
          </button>

          <div
            className={`grid overflow-hidden transition-all duration-300 ease-in-out ${
              showOptional ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="min-h-0">
              <div className="space-y-3 px-3 pb-3 pt-1">
            <input
              value={creditName}
              onChange={(e) => onCreditNameChange(e.target.value)}
              placeholder="Photographer name"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-neutral-400"
            />

            <input
              value={clientName}
              onChange={(e) => onClientNameChange(e.target.value)}
              placeholder="Client / Organization"
              className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-neutral-400"
            />
              </div>
            </div>
          </div>
        </div>

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