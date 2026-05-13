import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { positionService } from '../../services/positionService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Position } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function PositionList() {
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPosition, setEditingPosition] = useState<Position | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', base_salary: '', description: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 50 }
      if (search) params.search = search
      const res = await positionService.list(params)
      setPositions(res.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [search])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditingPosition(null)
    setFormData({ name: '', base_salary: '', description: '' })
    setModalOpen(true)
  }

  function openEdit(pos: Position) {
    setEditingPosition(pos)
    setFormData({ name: pos.name, base_salary: pos.base_salary.toString(), description: pos.description || '' })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const data = { ...formData, base_salary: Number(formData.base_salary) }
      if (editingPosition) {
        await positionService.update(editingPosition.id, data)
        toast.success('Cargo atualizado')
      } else {
        await positionService.create(data)
        toast.success('Cargo criado')
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
      await positionService.delete(deleteId)
      toast.success('Cargo removido')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
  }

  return (
    <PageContainer
      title="Cargos"
      actions={
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo</button>
      }
    >
      <div className="card">
        <SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Buscar cargo..." />
      </div>
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={[
            { key: 'name', header: 'Nome' },
            { key: 'base_salary', header: 'Salário Base', render: (item: Position) => formatCurrency(item.base_salary) },
            { key: 'description', header: 'Descrição', render: (item: Position) => item.description || '-' },
            { key: 'employees_count', header: 'Funcionários', render: (item: any) => item.employees_count || 0 },
          ]}
          data={positions}
          loading={loading}
          actions={(item: Position) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingPosition ? 'Editar Cargo' : 'Novo Cargo'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome *</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Salário Base (R$)</label>
            <input type="number" step="0.01" value={formData.base_salary} onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })} className="input-field" />
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

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Excluir Cargo" message="Tem certeza?" />
    </PageContainer>
  )
}
