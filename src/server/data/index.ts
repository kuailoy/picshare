import { storage } from "../storage"

// data layer is unaware of which storage provider is being used
export async function getGalleryImages() {
  return storage.searchGalleryImages()
}