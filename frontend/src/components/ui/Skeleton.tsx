interface SkeletonProps {
  className?: string
}

export function SkeletonRow({ cols = 7 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-800">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 bg-slate-800 rounded animate-pulse" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
      <td className="px-4 py-3">
        <div className="flex gap-2 justify-end">
          <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
          <div className="w-8 h-8 bg-slate-800 rounded-lg animate-pulse" />
        </div>
      </td>
    </tr>
  )
}

export function SkeletonCard() {
  return (
    <div className="card space-y-4">
      <div className="h-6 w-48 bg-slate-800 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-4 w-24 bg-slate-800 rounded mb-2 animate-pulse" />
            <div className="h-10 bg-slate-800 rounded-lg animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`h-4 bg-slate-800 rounded animate-pulse ${className}`} />
}
