import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SkeletonRow } from './Skeleton'

interface Column<T> {
  key: string
  header: string
  render?: (item: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  meta?: {
    current_page: number
    last_page: number
    total: number
  }
  onPageChange?: (page: number) => void
  actions?: (item: T) => React.ReactNode
}

export default function DataTable<T>({ columns, data, loading, meta, onPageChange, actions }: DataTableProps<T>) {
  if (loading && (!data || data.length === 0)) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700">
              {columns.map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-sm font-semibold text-slate-400">
                  {col.header}
                </th>
              ))}
              {actions && <th className="text-right px-4 py-3 text-sm font-semibold text-slate-400">Ações</th>}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length + (actions ? 1 : 0)} />
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400">
        <p className="text-lg font-medium">Nenhum registro encontrado</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map((col) => (
              <th key={col.key} className="text-left px-4 py-3 text-sm font-semibold text-slate-400">
                {col.header}
              </th>
            ))}
            {actions && <th className="text-right px-4 py-3 text-sm font-semibold text-slate-400">Ações</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((item: any, index) => (
            <tr key={item.id || index} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 text-sm text-slate-300">
                  {col.render ? col.render(item) : item[col.key]}
                </td>
              ))}
              {actions && (
                <td className="px-4 py-3 text-right">
                  {actions(item)}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {meta && meta.last_page > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-700">
          <p className="text-sm text-slate-400">
            Mostrando página {meta.current_page} de {meta.last_page} ({meta.total} registros)
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange?.(meta.current_page - 1)}
              disabled={meta.current_page <= 1}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-slate-400">{meta.current_page}</span>
            <button
              onClick={() => onPageChange?.(meta.current_page + 1)}
              disabled={meta.current_page >= meta.last_page}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
