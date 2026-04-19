'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'
import Bridge from '@/components/Icons/Bridge'
import Modal from '@/components/Modal'
import Upload from '@/components/Upload'
import UploadProcessBar from '@/components/UploadProcessBar'
import type { GalleryImage } from '@/types'
import { useLastViewedPhoto } from '@/utils/useLastViewedPhoto'

export default function Gallery({
  images,
  photoId,
  basePath = '/',
  folder,
  projectSlug,
  allowUpload = true,
  title = 'Photo Session Name',
  description = 'Photo Session Description',
  creditName,
  clientName,
}: {
  images: GalleryImage[]
  photoId?: string
  basePath?: string
  folder?: string
  projectSlug?: string
  allowUpload?: boolean
  title?: string
  description?: string
  creditName?: string
  clientName?: string
}) {
  const [lastViewedPhoto, setLastViewedPhoto] = useLastViewedPhoto()
  const [galleryImages, setGalleryImages] = useState(images)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState('')
  const [uploadTone, setUploadTone] = useState<'progress' | 'success' | 'warning' | 'error'>('progress')
  const lastViewedPhotoRef = useRef<HTMLAnchorElement>(null)
  const displayedImages = galleryImages.map((image, index) => ({
    ...image,
    id: index,
  }))

  useEffect(() => {
    setGalleryImages(images)
  }, [images])

  useEffect(() => {
    // This effect keeps track of the last viewed photo in the modal to keep the index page in sync when the user navigates back
    if (lastViewedPhoto && !photoId) {
      lastViewedPhotoRef.current?.scrollIntoView({ block: 'center' })
      setLastViewedPhoto(null)
    }
  }, [photoId, lastViewedPhoto, setLastViewedPhoto])

  const footerItems = [
    creditName ? `Photo by ${creditName}` : null,
    clientName ? `For ${clientName}` : null,
  ].filter(Boolean) as string[]

  return (
    <>
      <UploadProcessBar
        isUploading={isUploading}
        progress={uploadProgress}
        status={uploadStatus}
        tone={uploadTone}
      />
      <main className="mx-auto max-w-[1960px] p-4">
        {photoId && (
          <Suspense>
            <Modal
              images={displayedImages}
              basePath={basePath}
              onClose={() => {
                setLastViewedPhoto(photoId)
              }}
            />
          </Suspense>
        )}
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3 2xl:columns-4">
          <div className="after:content relative mb-5 flex h-[629px] flex-col items-center justify-end gap-4 overflow-hidden rounded-lg bg-white/10 px-6 pb-16 pt-64 text-center shadow-highlight after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight lg:pt-0">
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <span className="flex max-h-full max-w-full items-center justify-center">
                <Bridge />
              </span>
              <span className="absolute bottom-0 left-0 right-0 h-100 bg-linear-to-b from-black/0 via-black to-black"></span>
            </div>
            <div className="absolute right-0 top-0 z-10 flex gap-4 p-4">
              {allowUpload && (
                <>
                  <Upload
                    folder={folder}
                    projectSlug={projectSlug}
                    onUploadComplete={(uploadedImages) => {
                      setGalleryImages((currentImages) => [
                        ...uploadedImages,
                        ...currentImages,
                      ])
                    }}
                    onProgressChange={setUploadProgress}
                    onStatusChange={setUploadStatus}
                    onToneChange={setUploadTone}
                    onUploadingChange={setIsUploading}
                  />
                  <AdjustmentsHorizontalIcon className="h-6 w-6 hover:cursor-pointer" />
                </>
              )}
            </div>
            <h1 className="mb-4 mt-8 text-base font-bold uppercase tracking-widest">
              {title}
            </h1>
            <p className="max-w-[40ch] sm:max-w-[32ch]">{description}</p>
          </div>
          {displayedImages.map(({ id, public_id, format, blurDataUrl }) => (
            <Link
              key={id}
              href={`${basePath}?photoId=${id}`}
              ref={id === Number(lastViewedPhoto) ? lastViewedPhotoRef : null}
              className="after:content group relative mb-5 block w-full cursor-zoom-in after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:shadow-highlight"
            >
              <Image
                alt="Next.js Conf photo"
                className="transform rounded-lg brightness-90 transition will-change-auto group-hover:brightness-110"
                style={{ transform: 'translate3d(0, 0, 0)' }}
                placeholder={blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={blurDataUrl}
                src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_scale,w_720/${public_id}.${format}`}
                width={720}
                height={480}
                sizes="(max-width: 640px) 100vw,
                  (max-width: 1280px) 50vw,
                  (max-width: 1536px) 33vw,
                  25vw"
              />
            </Link>
          ))}
        </div>
      </main>
      {footerItems.length > 0 && (
        <footer className="px-4 pb-8 pt-8 text-center sm:pb-10">
          <p className="text-xs text-neutral-700 sm:text-sm">{footerItems.join(' · ')}</p>
        </footer>
      )}
    </>
  )
}
