import { ReactNode } from 'react'

interface DashboardCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color?: string
  subtitle?: string
}

export default function DashboardCard({ title, value, icon, color = 'primary', subtitle }: DashboardCardProps) {
  const colors: Record<string, string> = {
    primary: 'bg-primary-500',
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    purple: 'bg-violet-500',
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-6 flex items-center gap-4">
      <div className={`w-12 h-12 ${colors[color] || colors.primary} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-slate-400 truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  )
}
