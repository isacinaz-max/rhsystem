import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Menu, Sun, Moon, Bell, LogOut, User } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900 flex-shrink-0">
      <div className="flex items-center justify-between px-4 lg:px-6 h-full">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden lg:block">
          <h2 className="text-lg font-semibold text-white">
            Bem-vindo, {user?.name?.split(' ')[0]}{user?.company ? ` - ${user?.company?.razao_social}` : ''}
          </h2>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-800"
            >
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span className="hidden lg:block text-sm text-slate-300">{user?.name}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 rounded-lg shadow-lg border border-slate-800 py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-800">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                </div>
                <button
                  onClick={() => navigate('/settings')}
                  className="w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                >
                  <User className="w-4 h-4" /> Perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
