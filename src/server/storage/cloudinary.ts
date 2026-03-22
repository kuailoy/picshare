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
    .expression(`resource_type:image AND asset_folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by('public_id', 'desc')
    .max_results(400)
    .execute()

    return result.resources.map((item: any, index: number) => ({
      // UI routes and modal navigation are index-based (/?photoId=<index>)
      id: index,
      public_id: item.public_id,
      width: item.width,
      height: item.height,
      format: item.format,
  }))
}

// TODO: folder prefix should be based on userID
// For example `users/${userId}/posts/${params?.folder}`,
export function generateUploadSignature(params?: {
  folder?: string;
}) {
  const timestamp = Math.round(Date.now() / 1000);

  const uploadParams = {
    timestamp,
    folder: params?.folder || "samples",
  };

  const signature = cloudinary.utils.api_sign_request(
    uploadParams,
    process.env.CLOUDINARY_API_SECRET!
  );

  return {
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY!,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME!,
    folder: uploadParams.folder,
  };
}