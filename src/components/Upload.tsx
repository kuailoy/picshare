'use client'

import { ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { type ChangeEvent, useRef, useState } from 'react'
import type { GalleryImage } from '@/types'

type UploadProps = {
  folder?: string
  onUploadComplete: (images: GalleryImage[]) => void
  onProgressChange: (progress: number) => void
  onStatusChange: (status: string) => void
  onUploadingChange: (isUploading: boolean) => void
}

type CloudinaryUploadResult = {
  public_id: string
  width: number
  height: number
  format: string
  created_at?: string
}

export default function Upload({
  folder,
  onUploadComplete,
  onProgressChange,
  onStatusChange,
  onUploadingChange,
}: UploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const setUploading = (value: boolean) => {
    setIsUploading(value)
    onUploadingChange(value)
  }

  const uploadFile = ({
    cloudName,
    file,
    formData,
    onProgress,
  }: {
    cloudName: string
    file: File
    formData: FormData
    onProgress: (loaded: number) => void
  }) => {
    return new Promise<CloudinaryUploadResult>((resolve, reject) => {
      const request = new XMLHttpRequest()

      request.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(event.loaded)
        }
      }

      request.onload = () => {
        if (request.status >= 200 && request.status < 300) {
          resolve(JSON.parse(request.responseText))
          return
        }

        reject(new Error(`Failed to upload ${file.name}`))
      }

      request.onerror = () => {
        reject(new Error(`Failed to upload ${file.name}`))
      }

      request.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`)
      request.send(formData)
    })
  }

  const uploadFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    if (files.length === 0) {
      return
    }

    setUploading(true)
    onProgressChange(0)
    onStatusChange(`Preparing ${files.length} ${files.length === 1 ? 'image' : 'images'}...`)

    try {
      const signatureResponse = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folder }),
      })

      if (!signatureResponse.ok) {
        throw new Error('Failed to sign upload')
      }

      const { apiKey, cloudName, folder, signature, timestamp } = await signatureResponse.json()
      let completedUploads = 0
      const uploadedImages: (GalleryImage & { created_at?: string })[] = []
      const loadedByFile = new Map<string, number>()
      const totalBytes = files.reduce((total, file) => total + file.size, 0)

      await Promise.all(
        files.map(async (file, index) => {
          const fileKey = `${file.name}-${file.size}-${file.lastModified}-${index}`
          const formData = new FormData()

          formData.append('file', file)
          formData.append('api_key', apiKey)
          formData.append('folder', folder)
          formData.append('signature', signature)
          formData.append('timestamp', String(timestamp))

          const uploadedImage = await uploadFile({
            cloudName,
            file,
            formData,
            onProgress: (loaded) => {
              loadedByFile.set(fileKey, loaded)
              const loadedBytes = Array.from(loadedByFile.values()).reduce(
                (total, fileLoaded) => total + fileLoaded,
                0
              )

              onProgressChange(Math.min(99, Math.round((loadedBytes / totalBytes) * 100)))
            },
          })

          uploadedImages.push({
            id: 0,
            public_id: uploadedImage.public_id,
            width: String(uploadedImage.width),
            height: String(uploadedImage.height),
            format: uploadedImage.format,
            created_at: uploadedImage.created_at,
          })

          completedUploads += 1
          onStatusChange(
            `Uploaded ${completedUploads} of ${files.length} ${files.length === 1 ? 'image' : 'images'}`
          )
        })
      )

      onProgressChange(100)
      onStatusChange('Upload complete.')
      onUploadComplete(
        uploadedImages.sort((a, b) => {
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        })
      )
    } catch (error) {
      console.error(error)
      onStatusChange('Upload failed. Please try again.')
    } finally {
      setUploading(false)
      event.target.value = ''
      window.setTimeout(() => {
        onProgressChange(0)
        onStatusChange('')
      }, 2500)
    }
  }

  const openUploadPicker = () => {
    if (isUploading) {
      return
    }

    fileInputRef.current?.click()
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={uploadFiles}
      />
      <button
        type="button"
        aria-label="Upload images"
        className="disabled:cursor-wait disabled:opacity-50"
        disabled={isUploading}
        onClick={openUploadPicker}
      >
        <ArrowUpTrayIcon className="h-6 w-6 hover:cursor-pointer" />
      </button>
    </>
  )
}
