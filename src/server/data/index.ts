import { prisma } from '@/server/db/prisma'
import { storage } from '../storage'
import type { ProjectDetail, ProjectListItem } from '@/types'

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

export async function getProjectBySlug(slug: string): Promise<ProjectDetail | null> {
  return prisma.project.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      folder: true,
      creditName: true,
      clientName: true,
    },
  })
}

export async function getProjectByShareToken(token: string): Promise<ProjectDetail | null> {
  return prisma.project.findUnique({
    where: { shareToken: token },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      folder: true,
      creditName: true,
      clientName: true,
    },
  })
}

export async function getShareLink(slug: string): Promise<string | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    select: { shareToken: true },
  })

  return project?.shareToken ?? null
}

