'use client'

export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] gap-4">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-blue-400 rounded-full border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-300 font-medium">Loading latest news...</p>
    </div>
  )
}
