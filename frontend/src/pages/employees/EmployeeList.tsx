import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2, Eye } from 'lucide-react'
import { employeeService } from '../../services/employeeService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import { Employee } from '../../types'
import { formatCurrency, formatCPF, formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function EmployeeList() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewEmployee, setViewEmployee] = useState<Employee | null>(null)

  const loadEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, per_page: 15 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      const response = await employeeService.list(params)
      setEmployees(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      toast.error('Erro ao carregar funcionários')
    } finally {
      setLoading(false)
    }
  }, [page, search, statusFilter])

  useEffect(() => { loadEmployees() }, [loadEmployees])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await employeeService.delete(deleteId)
      toast.success('Funcionário removido com sucesso')
      setDeleteId(null)
      loadEmployees()
    } catch {
      toast.error('Erro ao remover funcionário')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    {
      key: 'photo',
      header: '',
      render: (item: Employee) => (
        item.photo_url
          ? <img src={item.photo_url} alt={item.name} className="w-9 h-9 rounded-full object-cover bg-slate-700" />
          : <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-400 font-medium">{item.name.charAt(0).toUpperCase()}</div>
      ),
    },
    { key: 'name', header: 'Nome' },
    { key: 'cpf', header: 'CPF', render: (item: Employee) => item.cpf ? formatCPF(item.cpf) : '-' },
    { key: 'position', header: 'Cargo', render: (item: Employee) => item.position?.name || '-' },
    { key: 'department', header: 'Departamento', render: (item: Employee) => item.department?.name || '-' },
    { key: 'salary', header: 'Salário', render: (item: Employee) => formatCurrency(item.salary) },
    { key: 'status', header: 'Status', render: (item: Employee) => <StatusBadge status={item.status} /> },
    { key: 'hire_date', header: 'Admissão', render: (item: Employee) => item.hire_date ? formatDate(item.hire_date) : '-' },
  ]

  return (
    <PageContainer
      title="Funcionários"
      subtitle="Gerencie todos os funcionários da empresa"
      actions={
        <button onClick={() => navigate('/employees/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Funcionário
        </button>
      }
    >
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar por nome, CPF ou email..." />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
            className="input-field w-full sm:w-48"
          >
            <option value="">Todos os status</option>
            <option value="ativo">Ativo</option>
            <option value="afastado">Afastado</option>
            <option value="ferias">Férias</option>
            <option value="desligado">Desligado</option>
          </select>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={employees}
          loading={loading}
          meta={meta}
          onPageChange={setPage}
          actions={(item: Employee) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setViewEmployee(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => navigate(`/employees/${item.id}/edit`)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Funcionário"
        message="Tem certeza que deseja excluir este funcionário? Esta ação não pode ser desfeita."
        loading={deleting}
      />

      <Modal open={!!viewEmployee} onClose={() => setViewEmployee(null)} title="Detalhes do Funcionário" size="lg">
        {viewEmployee && (
          <div className="space-y-4">
            {viewEmployee.photo_url && (
              <div className="flex justify-center mb-4">
                <img src={viewEmployee.photo_url} alt={viewEmployee.name} className="w-24 h-24 rounded-full object-cover bg-slate-700" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-slate-400">Nome</p><p className="text-white font-medium">{viewEmployee.name}</p></div>
              <div><p className="text-sm text-slate-400">CPF</p><p className="text-white">{viewEmployee.cpf ? formatCPF(viewEmployee.cpf) : '-'}</p></div>
              <div><p className="text-sm text-slate-400">Email</p><p className="text-white">{viewEmployee.email || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Telefone</p><p className="text-white">{viewEmployee.phone || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Cargo</p><p className="text-white">{viewEmployee.position?.name || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Departamento</p><p className="text-white">{viewEmployee.department?.name || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Salário</p><p className="text-white">{formatCurrency(viewEmployee.salary)}</p></div>
              <div><p className="text-sm text-slate-400">Status</p><StatusBadge status={viewEmployee.status} /></div>
              <div><p className="text-sm text-slate-400">Data Admissão</p><p className="text-white">{viewEmployee.hire_date ? formatDate(viewEmployee.hire_date) : '-'}</p></div>
              <div><p className="text-sm text-slate-400">Data Nascimento</p><p className="text-white">{viewEmployee.birth_date ? formatDate(viewEmployee.birth_date) : '-'}</p></div>
            </div>
            {viewEmployee.notes && (
              <div>
                <p className="text-sm text-slate-400 mb-1">Observações</p>
                <p className="text-white">{viewEmployee.notes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}
