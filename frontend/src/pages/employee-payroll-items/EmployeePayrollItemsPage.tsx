import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { employeePayrollItemService } from '../../services/employeePayrollItemService'
import { benefitService } from '../../services/benefitService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import EmployeeSelect from '../../components/company/EmployeeSelect'
import { EmployeePayrollItem, Benefit } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function EmployeePayrollItemsPage() {
  const [items, setItems] = useState<EmployeePayrollItem[]>([])
  const [loading, setLoading] = useState(true)
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editItem, setEditItem] = useState<EmployeePayrollItem | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 50 }
      if (employeeFilter) params.employee_id = employeeFilter
      const res = await employeePayrollItemService.list(params)
      setItems(res.data.data)
    } catch { toast.error('Erro ao carregar lançamentos') }
    finally { setLoading(false) }
  }, [employeeFilter])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await employeePayrollItemService.delete(deleteId)
      toast.success('Lançamento removido com sucesso')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
    finally { setDeleting(false) }
  }

  async function handleToggleActive(id: number) {
    try {
      await employeePayrollItemService.toggleActive(id)
      toast.success('Status alterado')
      load()
    } catch { toast.error('Erro ao alterar status') }
  }

  function handleEdit(item: EmployeePayrollItem) {
    setEditItem(item)
    setShowForm(true)
  }

  const columns = [
    { key: 'employee', header: 'Funcionário', render: (item: EmployeePayrollItem) => item.employee?.name || '-' },
    { key: 'benefit', header: 'Benefício', render: (item: EmployeePayrollItem) => item.benefit?.name || '-' },
    { key: 'description', header: 'Descrição' },
    { key: 'type', header: 'Tipo', render: (item: EmployeePayrollItem) => (
      <span className={`status-badge ${item.type === 'credit' ? 'status-active' : 'status-inactive'}`}>
        {item.type === 'credit' ? 'Crédito' : 'Débito'}
      </span>
    )},
    { key: 'calculation_type', header: 'Tipo Cálculo', render: (item: EmployeePayrollItem) => (
      <span>{item.calculation_type === 'fixed' ? 'Valor Fixo' : 'Percentual'}</span>
    )},
    { key: 'amount', header: 'Valor', render: (item: EmployeePayrollItem) => formatCurrency(Number(item.amount)) },
    { key: 'percentage', header: '%', render: (item: EmployeePayrollItem) => item.percentage ? `${item.percentage}%` : '-' },
    { key: 'active', header: 'Ativo', render: (item: EmployeePayrollItem) => (
      <span className={`status-badge ${item.active ? 'status-active' : 'status-inactive'}`}>
        {item.active ? 'Sim' : 'Não'}
      </span>
    )},
  ]

  return (
    <PageContainer
      title="Lançamentos do Funcionário"
      subtitle="Gerencie os lançamentos fixos dos funcionários para cálculo da folha"
      actions={
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Lançamento
        </button>
      }
    >
      <div className="card">
        <EmployeeSelect
          value={employeeFilter}
          onChange={(v) => setEmployeeFilter(v)}
          placeholder="Filtrar por funcionário"
        />
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          actions={(item: EmployeePayrollItem) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => handleToggleActive(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white" title={item.active ? 'Desativar' : 'Ativar'}>
                {item.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
              </button>
              <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      <Modal open={showForm} onClose={() => { setShowForm(false); setEditItem(null) }} title={editItem ? 'Editar Lançamento' : 'Novo Lançamento'} size="md">
        <ItemForm item={editItem} onSave={() => { setShowForm(false); setEditItem(null); load() }} onCancel={() => { setShowForm(false); setEditItem(null) }} />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Lançamento"
        message="Tem certeza que deseja excluir este lançamento?"
        loading={deleting}
      />
    </PageContainer>
  )
}

function ItemForm({ item, onSave, onCancel }: { item: EmployeePayrollItem | null; onSave: () => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false)
  const [benefits, setBenefits] = useState<Benefit[]>([])
  const [form, setForm] = useState({
    employee_id: item?.employee_id?.toString() || '',
    benefit_id: item?.benefit_id?.toString() || '',
    description: item?.description || '',
    type: item?.type || 'credit',
    calculation_type: item?.calculation_type || 'fixed',
    amount: item?.amount?.toString() || '0',
    percentage: item?.percentage?.toString() || '',
    reference_salary: item?.reference_salary ?? false,
    active: item?.active ?? true,
  })

  useEffect(() => {
    benefitService.list({ per_page: 100 })
      .then(res => setBenefits(res.data.data || []))
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = {
        ...form,
        employee_id: Number(form.employee_id),
        benefit_id: form.benefit_id ? Number(form.benefit_id) : null,
        amount: Number(form.amount),
        percentage: form.percentage ? Number(form.percentage) : null,
      }
      if (item) {
        await employeePayrollItemService.update(item.id, data)
        toast.success('Lançamento atualizado')
      } else {
        await employeePayrollItemService.create(data)
        toast.success('Lançamento cadastrado')
      }
      onSave()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar')
    } finally { setLoading(false) }
  }

  function handleBenefitChange(benefitId: string) {
    const benefit = benefits.find(b => b.id.toString() === benefitId)
    setForm(prev => ({
      ...prev,
      benefit_id: benefitId,
      description: benefit?.name || prev.description,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Funcionário *</label>
          <EmployeeSelect
            value={form.employee_id}
            onChange={(v) => setForm(prev => ({ ...prev, employee_id: v }))}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Vínculo com Benefício</label>
          <select value={form.benefit_id} onChange={e => handleBenefitChange(e.target.value)} className="input-field">
            <option value="">Nenhum (digitar descrição manualmente)</option>
            {benefits.map((b) => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-400 mb-1">Descrição *</label>
          <input value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} required className="input-field" placeholder="Ex: Salário Base, INSS, Plano de Saúde..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Tipo *</label>
          <select value={form.type} onChange={e => setForm(prev => ({ ...prev, type: e.target.value as 'credit' | 'debit' }))} className="input-field">
            <option value="credit">Crédito</option>
            <option value="debit">Débito</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Tipo de Cálculo *</label>
          <select value={form.calculation_type} onChange={e => setForm(prev => ({ ...prev, calculation_type: e.target.value as 'fixed' | 'percentage' }))} className="input-field">
            <option value="fixed">Valor Fixo</option>
            <option value="percentage">Percentual</option>
          </select>
        </div>
        {form.calculation_type === 'fixed' && (
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Valor (R$) *</label>
            <input type="number" step="0.01" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} required className="input-field" />
          </div>
        )}
        {form.calculation_type === 'percentage' && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Percentual (%) *</label>
              <input type="number" step="0.01" value={form.percentage} onChange={e => setForm(prev => ({ ...prev, percentage: e.target.value }))} required className="input-field" />
            </div>
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.reference_salary} onChange={e => setForm(prev => ({ ...prev, reference_salary: e.target.checked }))} className="w-4 h-4" />
                <span className="text-sm text-slate-300">Aplicar percentual sobre salário base</span>
              </label>
            </div>
          </>
        )}
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  )
}
