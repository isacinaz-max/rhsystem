import { NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { X, LayoutDashboard, Users, Building2, Briefcase, Clock, Sun, FileText, DollarSign, Gift, Search, BarChart3, Settings, Building, Receipt, Shield } from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/employees', label: 'Funcionários', icon: Users },
  { path: '/departments', label: 'Departamentos', icon: Building2 },
  { path: '/positions', label: 'Cargos', icon: Briefcase },
  { path: '/time-records', label: 'Ponto', icon: Clock },
  { path: '/vacations', label: 'Férias', icon: Sun },
  { path: '/payroll', label: 'Folha Pagamento', icon: DollarSign },
  { path: '/benefits', label: 'Benefícios', icon: Gift },
  { path: '/employee-payroll-items', label: 'Lançamentos Fixos', icon: Receipt },
  { path: '/companies', label: 'Empresas', icon: Building },
  { path: '/recruitments', label: 'Recrutamento', icon: Search },
  { path: '/candidates', label: 'Candidatos', icon: FileText },
  { path: '/reports', label: 'Relatórios', icon: BarChart3 },
  { path: '/users', label: 'Usuários', icon: Shield },
  { path: '/settings', label: 'Configurações', icon: Settings },
]

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { user } = useAuth()

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        w-64 flex-shrink-0 h-full bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800
        fixed top-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">RH</span>
            </div>
            <span className="font-bold text-lg text-gray-900 dark:text-white">RH System</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {user && (
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-800">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user.role}</p>
          </div>
        )}

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: 'calc(100vh - 8rem)' }}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-600/20 text-primary-400'
                    : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}
