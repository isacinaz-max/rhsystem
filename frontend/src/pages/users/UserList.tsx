import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { userService } from '../../services/userService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { User } from '../../types'
import toast from 'react-hot-toast'

export default function UserList() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<User[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({ page, per_page: 15 })
      setUsers(res.data.data)
      setMeta(res.data.meta)
    } catch { toast.error('Erro ao carregar usuários') }
    finally { setLoading(false) }
  }, [page])

  useEffect(() => { load() }, [load])

  async function handleDelete(id: number) {
    try {
      await userService.delete(id)
      toast.success('Usuário removido com sucesso')
      load()
    } catch { toast.error('Erro ao remover usuário') }
    finally { setDeleteId(null) }
  }

  const roleLabels: Record<string, string> = {
    administrador: 'Administrador',
    rh: 'RH',
    gestor: 'Gestor',
    funcionario: 'Funcionário',
  }

  const columns = [
    { key: 'name', header: 'Nome', render: (item: User) => item.name },
    { key: 'email', header: 'Email', render: (item: User) => item.email },
    {
      key: 'role',
      header: 'Perfil',
      render: (item: User) => (
        <span className="capitalize">{roleLabels[item.role] || item.role}</span>
      ),
    },
    {
      key: 'is_active',
      header: 'Ativo',
      render: (item: User) => (
        <span className={`status-badge ${item.is_active ? 'status-active' : 'status-inactive'}`}>
          {item.is_active ? 'Sim' : 'Não'}
        </span>
      ),
    },
  ]

  return (
    <PageContainer title="Usuários" subtitle="Gerenciamento de usuários do sistema">
      <div className="card">
        <div className="flex justify-end mb-4">
          <button onClick={() => navigate('/users/new')} className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> Novo Usuário
          </button>
        </div>
        <DataTable
          columns={columns}
          data={users}
          loading={loading}
          meta={meta}
          onPageChange={setPage}
          actions={(item: User) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => navigate(`/users/${item.id}/edit`)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white" title="Editar">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300" title="Remover">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Remover Usuário"
        message="Tem certeza que deseja remover este usuário?"
      />
    </PageContainer>
  )
}
