import cloudinary from '@/utils/cloudinary'
import getBase64ImageUrl from '@/utils/generateBlurPlaceholder'
import type { ImageProps } from '@/utils/types'
import Gallery from '@/components/Gallery'

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ photoId?: string }>
}) {
  const { photoId } = await searchParams

  const results = await cloudinary.search
    .expression(`resource_type:image AND folder:${process.env.CLOUDINARY_FOLDER}/*`)
    .sort_by('public_id', 'desc')
    .max_results(400)
    .execute()

  let reducedResults: ImageProps[] = []

  let i = 0
  for (let result of results.resources) {
    reducedResults.push({
      id: i,
      height: result.height,
      width: result.width,
      public_id: result.public_id,
      format: result.format,
    })
    i++
  }

  const blurImagePromises = results.resources.map((image: ImageProps) => {
    return getBase64ImageUrl(image)
  })
  const imagesWithBlurDataUrls = await Promise.all(blurImagePromises)

  for (let i = 0; i < reducedResults.length; i++) {
    reducedResults[i].blurDataUrl = imagesWithBlurDataUrls[i]
  }

  return <Gallery images={reducedResults} photoId={photoId} />
}
