import { GalleryImage } from "@/types";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
  secure: true,
});

export async function searchGalleryImages(): Promise<GalleryImage[]> {
  const result =  await cloudinary.search
    .expression(`resource_type:image AND folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by('public_id', 'desc')
    .max_results(400)
    .execute()

    return result.resources.map((item: any) => ({
      id: item.asset_id,
      publicId: item.public_id,
      width: item.width,
      height: item.height,
      format: item.format,
  }))
}
