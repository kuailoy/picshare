import { prisma } from '@/server/db/prisma'
import { storage } from '../storage'

export async function getGalleryImages(folder?: string) {
  return storage.searchGalleryImages({ folder })
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

