export interface GalleryImage {
  id: number;
  height: string;
  width: string;
  public_id: string;
  format: string;
  blurDataUrl?: string;
}

export type ProjectListItem = {
  id: string
  slug: string
  name: string
  description?: string | null
  folder: string
  coverImageUrl?: string | null
}

export type ProjectDetail = {
  id: string
  slug: string
  name: string
  description?: string | null
  folder: string
  creditName?: string | null
  clientName?: string | null
}
