import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import Card from '../components/ui/Card'
import PageContainer from '../components/ui/PageContainer'
import { Sun, Moon, Shield, Save, Loader2 } from 'lucide-react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export default function Settings() {
  const { user } = useAuth()
  const { isDark, toggle } = useTheme()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Preencha todos os campos')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }
    if (newPassword.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await authService.changePassword({ current_password: currentPassword, new_password: newPassword })
      toast.success('Senha alterada com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao alterar senha')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer title="Configurações" subtitle="Gerencie suas preferências do sistema">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Perfil do Usuário">
          <div className="space-y-3">
            <div><p className="text-sm text-slate-400">Nome</p><p className="font-medium text-white">{user?.name}</p></div>
            <div><p className="text-sm text-slate-400">Email</p><p className="font-medium text-white">{user?.email}</p></div>
            <div><p className="text-sm text-slate-400">Tipo</p><p className="font-medium capitalize text-white">{user?.role}</p></div>
          </div>
        </Card>

        <Card title="Aparência">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-slate-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
              <div>
                <p className="text-sm font-medium text-white">Tema {isDark ? 'Escuro' : 'Claro'}</p>
                <p className="text-xs text-slate-400">Alternar entre tema claro e escuro</p>
              </div>
            </div>
            <button
              onClick={toggle}
              className={`relative w-12 h-6 rounded-full transition-colors ${isDark ? 'bg-primary-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isDark ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </button>
          </div>
        </Card>

        <Card title="Alterar Senha">
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Senha Atual</label>
              <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Nova Senha</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Confirmar Nova Senha</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" /> Alterar Senha
            </button>
          </form>
        </Card>
      </div>
    </PageContainer>
  )
}
