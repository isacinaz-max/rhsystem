import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { departmentService } from '../../services/departmentService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Department } from '../../types'
import toast from 'react-hot-toast'

export default function DepartmentList() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', responsible: '', description: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 50 }
      if (search) params.search = search
      const res = await departmentService.list(params)
      setDepartments(res.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditingDepartment(null)
    setFormData({ name: '', responsible: '', description: '' })
    setModalOpen(true)
  }

  function openEdit(dept: Department) {
    setEditingDepartment(dept)
    setFormData({
      name: dept.name,
      responsible: (dept as any).responsible?.id?.toString() || '',
      description: dept.description || '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const payload = {
        name: formData.name,
        responsible: formData.responsible ? Number(formData.responsible) : null,
        description: formData.description,
      }
      if (editingDepartment) {
        await departmentService.update(editingDepartment.id, payload)
        toast.success('Departamento atualizado')
      } else {
        await departmentService.create(payload)
        toast.success('Departamento criado')
      }
      setModalOpen(false)
      load()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await departmentService.delete(deleteId)
      toast.success('Departamento removido')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
  }

  const columns = [
    { key: 'name', header: 'Nome' },
    { key: 'responsible', header: 'Responsável', render: (item: Department) => (item as any).responsible?.name || '-' },
    { key: 'description', header: 'Descrição', render: (item: Department) => item.description || '-' },
    { key: 'employees_count', header: 'Funcionários', render: (item: any) => item.employees_count || 0 },
  ]

  return (
    <PageContainer
      title="Departamentos"
      actions={
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo</button>
      }
    >
      <div className="card">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Buscar departamento..." />
      </div>
      <div className="card p-0 overflow-hidden">
        <DataTable columns={columns} data={departments} loading={loading} actions={(item: Department) => (
          <div className="flex gap-2 justify-end">
            <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
            <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
          </div>
        )} />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome *</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">ID do Responsável</label>
            <input type="number" value={formData.responsible} onChange={(e) => setFormData({ ...formData, responsible: e.target.value })} className="input-field" placeholder="ID do usuário responsável" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="input-field" />
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} className="btn-primary">Salvar</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Excluir Departamento" message="Tem certeza?" />
    </PageContainer>
  )
}
