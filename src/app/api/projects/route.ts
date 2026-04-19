import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
})

function normalizeSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = createProjectSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 })
  }

  const { name } = result.data
  const slug = normalizeSlug(name)

  try {
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        folder: slug,
        shareToken: nanoid(32),
        isPublic: false,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        folder: true,
        shareToken: true,
      },
    })

    return NextResponse.json(project)
  } catch (error: any) {
    console.error(error)

    // 判断 unique constraint
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}
