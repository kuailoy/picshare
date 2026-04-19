import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/server/db/prisma'
import { deleteUploadedImages } from '@/server/storage/cloudinary'

const createImagesSchema = z.object({
  images: z.array(
    z.object({
      publicId: z.string().min(1),
      url: z.string().url(),
      width: z.number().int().positive().optional(),
      height: z.number().int().positive().optional(),
      format: z.string().min(1).optional(),
    }),
  ).min(1),
})

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const body = await request.json().catch(() => null)
  const parsed = createImagesSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const project = await prisma.project.findUnique({
    where: { slug },
    select: { id: true },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 })
  }

  const images = parsed.data.images

  try {
    const result = await prisma.image.createMany({
      data: images.map((image) => ({
        projectId: project.id,
        publicId: image.publicId,
        url: image.url,
        width: image.width,
        height: image.height,
        format: image.format,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({ inserted: result.count })
  } catch (error) {
    console.error(error)

    try {
      await deleteUploadedImages(images.map((image) => image.publicId))
    } catch (rollbackError) {
      console.error('rollback failed', rollbackError)
    }

    return NextResponse.json({ error: 'Failed to persist uploaded images' }, { status: 500 })
  }
}