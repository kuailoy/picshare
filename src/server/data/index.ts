import { prisma } from '@/server/db/prisma'
import { storage } from '../storage'
import type { ProjectListItem } from '@/types'

export async function getGalleryImages(folder?: string) {
  return storage.searchGalleryImages({ folder })
}

export async function getProjects(): Promise<ProjectListItem[]> {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      folder: true,
      coverImage: {
        select: {
          url: true,
        },
      },
      images: {
        select: {
          url: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 1,
      },
    },
  })

  return projects.map((project) => ({
    id: project.id,
    slug: project.slug,
    name: project.name,
    description: project.description,
    folder: project.folder,
    coverImageUrl:
      project.coverImage?.url ?? project.images[0]?.url ?? null,
  }))
}

export async function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
  })
}

export async function getProjectByShareToken(token: string) {
  return prisma.project.findUnique({
    where: { shareToken: token },
  })
}

