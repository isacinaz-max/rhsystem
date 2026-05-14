import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2, Plus, Trash2 } from 'lucide-react'
import { payrollService } from '../../services/payrollService'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import { Payroll, PayrollItem } from '../../types'
import { formatCurrency, formatMonthYear } from '../../utils/formatters'
import toast from 'react-hot-toast'

interface EditableItem {
  id?: number
  description: string
  type: 'credit' | 'debit'
  calculation_type: 'fixed' | 'percentage'
  amount: number
  percentage?: number
  calculated_amount: number
  _tempId?: string
}

export default function PayrollEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payroll, setPayroll] = useState<Payroll | null>(null)
  const [items, setItems] = useState<EditableItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await payrollService.find(Number(id))
        const p = res.data.data
        setPayroll(p)
        if (p.items) {
          setItems(p.items.map((i: PayrollItem) => ({
              id: i.id,
              description: i.description,
              type: i.type,
              calculation_type: i.calculation_type,
              amount: Number(i.amount),
              percentage: i.percentage ? Number(i.percentage) : undefined,
              calculated_amount: Number(i.calculated_amount),
            })))
        }
      } catch { toast.error('Erro ao carregar folha') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  function addItem(type: 'credit' | 'debit') {
    setItems(prev => [...prev, {
      description: '',
      type,
      calculation_type: 'fixed',
      amount: 0,
      calculated_amount: 0,
      _tempId: crypto.randomUUID(),
    }])
  }

  function removeItem(index: number) {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  function updateItem(index: number, field: string, value: any) {
    setItems(prev => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }

      if (field === 'calculation_type' || field === 'amount' || field === 'percentage') {
        const item = updated[index]
        if (item.calculation_type === 'fixed') {
          updated[index].calculated_amount = Number(item.amount)
        } else {
          const base = payroll?.base_salary ? Number(payroll.base_salary) : 0
          updated[index].calculated_amount = base * (Number(item.percentage || 0) / 100)
        }
      }
      return updated
    })
  }

  function getTotalCredit() {
    return items.filter(i => i.type === 'credit').reduce((sum, i) => sum + Number(i.calculated_amount), 0)
  }

  function getTotalDebit() {
    return items.filter(i => i.type === 'debit').reduce((sum, i) => sum + Number(i.calculated_amount), 0)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await payrollService.update(Number(id), { items })
      toast.success('Folha atualizada com sucesso')
      navigate(`/payroll/${id}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <PageContainer title="Editar Folha">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </PageContainer>
    )
  }

  if (!payroll) {
    return <PageContainer title="Editar Folha"><p className="text-slate-400">Folha não encontrada</p></PageContainer>
  }

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(`/payroll/${id}`)} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-title">Editar Folha</h1>
            <p className="text-sm text-slate-400">
              {payroll.employee?.name} - {payroll.competence || formatMonthYear(payroll.reference_month, payroll.reference_year)}
            </p>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <Save className="w-4 h-4" /> Salvar
        </button>
      </div>

      <div className="card mb-4">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Salário Base</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(Number(payroll.base_salary))}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Créditos</h3>
            <button onClick={() => addItem('credit')} className="btn-sm btn-primary flex items-center gap-1">
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          </div>
          {items.filter(i => i.type === 'credit').length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhum crédito</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => item.type === 'credit' && (
                <div key={item._tempId || item.id} className="p-3 bg-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} placeholder="Descrição" className="input-field flex-1 mr-2" />
                    <button onClick={() => removeItem(index)} className="p-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    <select value={item.calculation_type} onChange={e => updateItem(index, 'calculation_type', e.target.value)} className="input-field w-40">
                      <option value="fixed">Valor Fixo</option>
                      <option value="percentage">Percentual</option>
                    </select>
                    {item.calculation_type === 'fixed' ? (
                      <input type="number" step="0.01" value={item.amount} onChange={e => updateItem(index, 'amount', Number(e.target.value))} className="input-field flex-1" />
                    ) : (
                      <input type="number" step="0.01" value={item.percentage || ''} onChange={e => updateItem(index, 'percentage', Number(e.target.value))} className="input-field w-24" placeholder="%" />
                    )}
                    <div className="flex items-center text-emerald-400 font-semibold min-w-[100px] justify-end">
                      {formatCurrency(Number(item.calculated_amount))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                <p className="text-white font-semibold">Total Créditos</p>
                <p className="text-emerald-400 font-bold text-lg">{formatCurrency(getTotalCredit())}</p>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Débitos</h3>
            <button onClick={() => addItem('debit')} className="btn-sm btn-primary flex items-center gap-1">
              <Plus className="w-3 h-3" /> Adicionar
            </button>
          </div>
          {items.filter(i => i.type === 'debit').length === 0 ? (
            <p className="text-slate-400 text-sm">Nenhum débito</p>
          ) : (
            <div className="space-y-3">
              {items.map((item, index) => item.type === 'debit' && (
                <div key={item._tempId || item.id} className="p-3 bg-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <input value={item.description} onChange={e => updateItem(index, 'description', e.target.value)} placeholder="Descrição" className="input-field flex-1 mr-2" />
                    <button onClick={() => removeItem(index)} className="p-1 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="flex gap-2">
                    <select value={item.calculation_type} onChange={e => updateItem(index, 'calculation_type', e.target.value)} className="input-field w-40">
                      <option value="fixed">Valor Fixo</option>
                      <option value="percentage">Percentual</option>
                    </select>
                    {item.calculation_type === 'fixed' ? (
                      <input type="number" step="0.01" value={item.amount} onChange={e => updateItem(index, 'amount', Number(e.target.value))} className="input-field flex-1" />
                    ) : (
                      <input type="number" step="0.01" value={item.percentage || ''} onChange={e => updateItem(index, 'percentage', Number(e.target.value))} className="input-field w-24" placeholder="%" />
                    )}
                    <div className="flex items-center text-red-400 font-semibold min-w-[100px] justify-end">
                      {formatCurrency(Number(item.calculated_amount))}
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                <p className="text-white font-semibold">Total Débitos</p>
                <p className="text-red-400 font-bold text-lg">{formatCurrency(getTotalDebit())}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Salário Líquido</p>
            <p className="text-2xl font-bold text-primary-400">{formatCurrency(Number(payroll.base_salary) + getTotalCredit() - getTotalDebit())}</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" /> Salvar Alterações
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
