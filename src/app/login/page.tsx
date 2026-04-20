'use client'

import { FormEvent, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const callbackUrl = searchParams.get('callbackUrl') ?? '/projects'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setStatus('sending')
    setMessage('')

    const result = await signIn('email', {
      email: trimmedEmail,
      redirect: false,
      callbackUrl,
    })

    if (result?.error) {
      setStatus('error')
      setMessage('Failed to send the sign-in link.')
      return
    }

    setStatus('sent')
    setMessage('Check your email for the sign-in link.')
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md items-center px-4 py-12">
      <form onSubmit={handleSubmit} className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
        <p className="mt-2 text-sm text-gray-600">Use your email to receive a magic link.</p>

        <label className="mt-6 block text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2 outline-none ring-0 focus:border-gray-900"
          autoComplete="email"
          required
        />

        <button
          type="submit"
          disabled={status === 'sending'}
          className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending...' : 'Send sign-in link'}
        </button>

        {message && (
          <p className={`mt-4 text-sm ${status === 'error' ? 'text-red-600' : 'text-green-700'}`}>
            {message}
          </p>
        )}
      </form>
    </main>
  )
}