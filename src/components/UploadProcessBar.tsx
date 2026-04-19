'use client'

type UploadProcessBarProps = {
  isUploading: boolean
  progress: number
  status: string
  tone?: 'progress' | 'success' | 'warning' | 'error'
}

export default function UploadProcessBar({
  isUploading,
  progress,
  status,
  tone = 'progress',
}: UploadProcessBarProps) {
  if (!isUploading && !status) {
    return null
  }

  const barToneClass =
    tone === 'success'
      ? 'from-emerald-300 via-emerald-400 to-emerald-500'
      : tone === 'warning'
      ? 'from-amber-300 via-amber-400 to-amber-500'
      : tone === 'error'
      ? 'from-rose-300 via-rose-400 to-rose-500'
      : 'from-sky-200 via-cyan-300 to-sky-500'

  const textToneClass =
    tone === 'success'
      ? 'bg-emerald-500/85 text-white'
      : tone === 'warning'
      ? 'bg-amber-500/90 text-white'
      : tone === 'error'
      ? 'bg-rose-500/85 text-white'
      : 'bg-black/70 text-white'

  const currentProgress = isUploading ? progress : 100

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <div
        className="h-1 bg-white/20"
        aria-label={`${status} ${currentProgress}%`}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={currentProgress}
      >
        <div
          className={`h-full bg-linear-to-r transition-all duration-300 ${barToneClass}`}
          style={{ width: `${currentProgress}%` }}
        />
      </div>

      {status && (
        <div className="flex justify-center pt-1">
          <div className={`rounded px-2 py-0.5 text-[11px] font-medium ${textToneClass}`}>
            {status}
          </div>
        </div>
      )}

      <div className="sr-only">
        {status} {currentProgress}%
      </div>
    </div>
  )
}
