import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Loader2, Shield } from 'lucide-react'
import PageContainer from '../../components/ui/PageContainer'
import { userService } from '../../services/userService'
import { User } from '../../types'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  email: string
  password: string
  role: string
  is_active: boolean
  permissions: string[]
}

const permissionOptions = [
  { value: 'create', label: 'Incluir' },
  { value: 'update', label: 'Alterar' },
  { value: 'delete', label: 'Excluir' },
  { value: 'reports', label: 'Relatórios' },
]

const roleOptions = [
  { value: 'administrador', label: 'Administrador' },
  { value: 'rh', label: 'RH' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'funcionario', label: 'Funcionário' },
]

export default function UserForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditing)

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'funcionario',
      is_active: true,
      permissions: [],
    }
  })

  const selectedPermissions = watch('permissions') || []
  const selectedRole = watch('role')

  function togglePermission(permission: string) {
    const current = selectedPermissions || []
    const updated = current.includes(permission)
      ? current.filter((p: string) => p !== permission)
      : [...current, permission]
    setValue('permissions', updated)
  }

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await userService.find(Number(id))
        const user = res.data.data
        reset({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role,
          is_active: user.is_active,
          permissions: user.permissions || [],
        })
      } catch { toast.error('Erro ao carregar usuário') }
      finally { setPageLoading(false) }
    }
    if (isEditing) loadUser()
  }, [id, isEditing, reset])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        role: data.role,
        is_active: data.is_active,
        permissions: data.permissions,
      }
      if (data.password) payload.password = data.password

      if (isEditing) {
        await userService.update(Number(id), payload)
        toast.success('Usuário atualizado com sucesso')
      } else {
        await userService.create(payload)
        toast.success('Usuário cadastrado com sucesso')
      }
      navigate('/users')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar usuário')
    } finally { setLoading(false) }
  }

  if (pageLoading) {
    return (
      <PageContainer title="Carregando...">
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/users')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="page-title">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados do Usuário</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Nome *</label>
              <input {...register('name', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Email *</label>
              <input type="email" {...register('email', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">
                {isEditing ? 'Senha (deixe em branco para manter)' : 'Senha *'}
              </label>
              <input type="password" {...register('password', { required: !isEditing, minLength: 6 })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Perfil *</label>
              <select {...register('role', { required: true })} className="input-field">
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" {...register('is_active')} className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-primary-500" id="is_active" />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-500 dark:text-slate-400">Usuário ativo</label>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Permissões Específicas</h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
            Defina permissões adicionais para este usuário (aplicável para perfis RH e Gestor).
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {permissionOptions.map((perm) => (
              <label
                key={perm.value}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedPermissions.includes(perm.value)
                    ? 'bg-primary-600/20 border-primary-500 text-primary-400'
                    : 'border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedPermissions.includes(perm.value)}
                  onChange={() => togglePermission(perm.value)}
                  className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm font-medium">{perm.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/users')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {isEditing ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </PageContainer>
  )
}
