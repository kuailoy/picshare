import { storage } from "../storage"

export async function getGalleryImages() {
  return storage.searchGalleryImages()
}

