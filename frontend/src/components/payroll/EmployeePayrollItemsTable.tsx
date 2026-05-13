import { useEffect, useState } from 'react'
import { ToggleLeft, ToggleRight } from 'lucide-react'
import { employeePayrollItemService } from '../../services/employeePayrollItemService'
import { EmployeePayrollItem } from '../../types'
import { formatCurrency } from '../../utils/formatters'

interface EmployeePayrollItemsTableProps {
  employeeId: number
}

export default function EmployeePayrollItemsTable({ employeeId }: EmployeePayrollItemsTableProps) {
  const [items, setItems] = useState<EmployeePayrollItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employeeId) return
    setLoading(true)
    employeePayrollItemService.byEmployee(employeeId)
      .then(res => setItems(res.data.data || res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [employeeId])

  async function handleToggle(id: number) {
    try {
      await employeePayrollItemService.toggleActive(id)
      setItems(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i))
    } catch { /* ignore */ }
  }

  if (loading) return <p className="text-sm text-slate-400">Carregando...</p>
  if (items.length === 0) return <p className="text-sm text-slate-400">Nenhum lançamento cadastrado</p>

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
          <div>
            <p className="text-white text-sm font-medium">{item.description}</p>
            <p className="text-xs text-slate-400">
              {item.type === 'credit' ? 'Crédito' : 'Débito'} - {item.calculation_type === 'fixed' ? 'Valor Fixo' : 'Percentual'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-semibold ${item.type === 'credit' ? 'text-emerald-400' : 'text-red-400'}`}>
              {formatCurrency(Number(item.amount))}
            </span>
            <button onClick={() => handleToggle(item.id)} className="text-slate-400 hover:text-white">
              {item.active ? <ToggleRight className="w-4 h-4 text-emerald-400" /> : <ToggleLeft className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
