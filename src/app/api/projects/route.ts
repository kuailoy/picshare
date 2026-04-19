import { nanoid } from 'nanoid'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { getProjects } from '@/server/data'

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  creditName: z.string().trim().min(1).optional(),
  clientName: z.string().trim().min(1).optional(),
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

  const { name, creditName, clientName } = result.data
  const slug = normalizeSlug(name)

  try {
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        folder: slug,
        shareToken: nanoid(32),
        isPublic: false,
        creditName,
        clientName,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        folder: true,
        shareToken: true,
        creditName: true,
        clientName: true,
      },
    })

    revalidatePath('/projects')

    return NextResponse.json(project)
  } catch (error: any) {
    console.error(error)

    // 判断 unique constraint
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'slug already exists' }, { status: 400 })
    }

    if (error?.code === 'P1003' || error?.code === 'P1001') {
      return NextResponse.json(
        { error: 'Database connection is not ready. Please check DATABASE_URL and restart dev server.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
  }
}

export async function GET() {
  const projects = await getProjects()

  return NextResponse.json(projects)
}
