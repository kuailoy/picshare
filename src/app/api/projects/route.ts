import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'

const createProjectSchema = z.object({
  name: z.string().trim().min(1),
  slug: z.string().trim().min(1),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const result = createProjectSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'name and slug are required' },
      { status: 400 }
    )
  }

  const { name, slug } = result.data

  const existingProject = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (existingProject) {
    return NextResponse.json(
      { error: 'slug already exists' },
      { status: 400 }
    )
  }

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
}
