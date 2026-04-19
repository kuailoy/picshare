export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-xl font-semibold text-gray-900">PicShare</div>
        <button className="rounded-md border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50">
          Login
        </button>
      </div>
    </header>
  )
}
