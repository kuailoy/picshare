import { NextResponse } from 'next/server'
import { getShareLink } from '@/server/data'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const shareToken = await getShareLink(slug)

  if (!shareToken) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  return NextResponse.json({ shareToken })
}