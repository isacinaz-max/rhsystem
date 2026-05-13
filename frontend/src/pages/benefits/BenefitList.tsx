import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { benefitService } from '../../services/benefitService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Benefit } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

const BENEFIT_TYPES = [
  { value: 'vale_transporte', label: 'Vale Transporte' },
  { value: 'vale_alimentacao', label: 'Vale Alimentação' },
  { value: 'plano_saude', label: 'Plano de Saúde' },
  { value: 'plano_odontologico', label: 'Plano Odontológico' },
  { value: 'seguro_vida', label: 'Seguro de Vida' },
  { value: 'auxilio_creche', label: 'Auxílio Creche' },
  { value: 'outro', label: 'Outro' },
]

export default function BenefitList() {
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBenefit, setEditingBenefit] = useState<Benefit | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', value: '', type: 'vale_transporte', description: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await benefitService.list({ per_page: 50 })
      setBenefits(res.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditingBenefit(null)
    setFormData({ name: '', value: '', type: 'vale_transporte', description: '' })
    setModalOpen(true)
  }

  function openEdit(benefit: Benefit) {
    setEditingBenefit(benefit)
    setFormData({
      name: benefit.name,
      value: benefit.value.toString(),
      type: benefit.type || 'outro',
      description: benefit.description || '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const data = { name: formData.name, value: Number(formData.value), type: formData.type, description: formData.description }
      if (editingBenefit) {
        await benefitService.update(editingBenefit.id, data)
        toast.success('Benefício atualizado')
      } else {
        await benefitService.create(data)
        toast.success('Benefício criado')
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
      await benefitService.delete(deleteId)
      toast.success('Benefício removido')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
  }

  return (
    <PageContainer
      title="Benefícios"
      actions={
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo</button>
      }
    >
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={[
            { key: 'name', header: 'Nome' },
            { key: 'type', header: 'Tipo', render: (item: Benefit) => BENEFIT_TYPES.find(t => t.value === item.type)?.label || item.type },
            { key: 'description', header: 'Descrição', render: (item: Benefit) => item.description || '-' },
            { key: 'value', header: 'Valor', render: (item: Benefit) => formatCurrency(item.value) },
          ]}
          data={benefits}
          loading={loading}
          actions={(item: Benefit) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingBenefit ? 'Editar Benefício' : 'Novo Benefício'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nome *</label>
            <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Tipo *</label>
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="input-field">
              {BENEFIT_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Valor (R$) *</label>
            <input type="number" step="0.01" min="0" value={formData.value} onChange={(e) => setFormData({ ...formData, value: e.target.value })} className="input-field" />
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

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Excluir Benefício" message="Tem certeza?" />
    </PageContainer>
  )
}
