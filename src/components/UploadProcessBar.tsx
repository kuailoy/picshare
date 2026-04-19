'use client'

type UploadProcessBarProps = {
  isUploading: boolean
  progress: number
  status: string
}

export default function UploadProcessBar({
  isUploading,
  progress,
  status,
}: UploadProcessBarProps) {
  if (!isUploading && !status) {
    return null
  }

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5"
      aria-label={`${status} ${progress}%`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
    >
      <div
        className="h-full bg-linear-to-r from-sky-200 via-cyan-300 to-sky-500 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      <div className="sr-only">
        {status} {progress}%
      </div>
    </div>
  )
}
