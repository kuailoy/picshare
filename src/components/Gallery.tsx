'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Suspense, useEffect, useRef, useState } from 'react'
import { AdjustmentsHorizontalIcon, ShareIcon } from '@heroicons/react/24/outline'
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
  const [isLoadingShareLink, setIsLoadingShareLink] = useState(false)
  const [isCopyingShareLink, setIsCopyingShareLink] = useState(false)
  const [isShareModalOpen, setIsShareModalOpen] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [shareError, setShareError] = useState('')
  const [shareCopyLabel, setShareCopyLabel] = useState('Copy')
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

  const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }

    const input = document.createElement('textarea')
    input.value = text
    input.setAttribute('readonly', '')
    input.style.position = 'absolute'
    input.style.left = '-9999px'
    document.body.appendChild(input)
    input.select()
    const copied = document.execCommand('copy')
    document.body.removeChild(input)

    if (!copied) {
      throw new Error('copy command failed')
    }
  }

  const openShareModal = async () => {
    if (!projectSlug || isLoadingShareLink) {
      return
    }

    setIsLoadingShareLink(true)
    setShareError('')
    setShareCopyLabel('Copy')
    setIsShareModalOpen(true)

    try {
      const response = await fetch(`/api/projects/${projectSlug}/share-link`)

      if (!response.ok) {
        throw new Error('failed to fetch share token')
      }

      const data = await response.json() as { shareToken?: string }

      if (!data.shareToken) {
        throw new Error('missing share token')
      }

      setShareLink(`${window.location.origin}/share/${data.shareToken}`)
    } catch (error) {
      console.error(error)
      setShareLink('')
      setShareError('Failed to generate link. Please try again.')
    } finally {
      setIsLoadingShareLink(false)
    }
  }

  const handleCopyShareLink = async () => {
    if (!shareLink || isCopyingShareLink) {
      return
    }

    setIsCopyingShareLink(true)

    try {
      await copyText(shareLink)
      setShareCopyLabel('Copied')
      setTimeout(() => setShareCopyLabel('Copy'), 1600)
    } catch (error) {
      console.error(error)
      setShareCopyLabel('Failed')
      setTimeout(() => setShareCopyLabel('Copy'), 1600)
    } finally {
      setIsCopyingShareLink(false)
    }
  }

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
                  <button
                    type="button"
                    onClick={openShareModal}
                    disabled={isLoadingShareLink}
                    className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white shadow-sm transition duration-200 hover:scale-105 hover:bg-black/55 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Share project"
                    title="Share project"
                  >
                    <ShareIcon className="h-4 w-4 transition-transform duration-200 group-hover:rotate-6" />
                  </button>
                  {/* <AdjustmentsHorizontalIcon className="h-6 w-6 hover:cursor-pointer" /> */}
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
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/20 bg-neutral-950 p-4 text-white shadow-2xl">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wide">Share Link</h2>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="rounded-md px-2 py-1 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Close
              </button>
            </div>
            <p className="mb-2 text-xs text-white/70">
              Copy failed? You can select the link below and copy it manually.
            </p>
            {isLoadingShareLink ? (
              <p className="mb-3 text-sm text-white/80">Generating link...</p>
            ) : (
              <>
                <input
                  value={shareLink}
                  readOnly
                  onFocus={(event) => event.currentTarget.select()}
                  className="mb-3 w-full rounded-md border border-white/20 bg-black/30 px-3 py-2 text-sm text-white outline-none ring-white/40 placeholder:text-white/40 focus:ring-2"
                  placeholder="Share link will appear here"
                />
                {shareError && <p className="mb-3 text-xs text-red-300">{shareError}</p>}
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  disabled={!shareLink || isCopyingShareLink}
                  className="w-full rounded-md border border-white/30 bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isCopyingShareLink ? 'Copying...' : shareCopyLabel}
                </button>
              </>
            )}
          </div>
        </div>
      )}
      {footerItems.length > 0 && (
        <footer className="px-4 pb-8 pt-8 text-center sm:pb-10">
          <p className="text-xs text-neutral-700 sm:text-sm">{footerItems.join(' · ')}</p>
        </footer>
      )}
    </>
  )
}
