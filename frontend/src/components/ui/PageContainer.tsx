import { ReactNode } from 'react'

interface PageContainerProps {
  title?: string
  subtitle?: string
  actions?: ReactNode
  children: ReactNode
}

export default function PageContainer({ title, subtitle, actions, children }: PageContainerProps) {
  return (
    <div className="flex flex-col gap-6">
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>}
            {subtitle && <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
