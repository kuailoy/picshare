'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'

type AuthMenuProps = {
  email: string | null
}

export default function AuthMenu({ email }: AuthMenuProps) {
  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
      >
        Sign in
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-sm text-gray-600 sm:inline">{email}</span>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
      >
        Sign out
      </button>
    </div>
  )
}