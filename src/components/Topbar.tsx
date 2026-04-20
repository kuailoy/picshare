import Link from 'next/link'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/auth'
import AuthMenu from './AuthMenu'

export default async function Topbar() {
  const session = await getServerSession(authOptions)

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-screen-2xl items-center justify-between px-4">
        <Link href="/projects" className="text-xl font-semibold text-gray-900">
          PicShare
        </Link>
        <AuthMenu email={session?.user?.email ?? null} />
      </div>
    </header>
  )
}
