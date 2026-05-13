import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import Modal from '../ui/Modal'
import { payrollService } from '../../services/payrollService'
import { Payroll, PayrollItem } from '../../types'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface PayrollDetailsModalProps {
  payrollId: number | null
  onClose: () => void
}

export default function PayrollDetailsModal({ payrollId, onClose }: PayrollDetailsModalProps) {
  const [payroll, setPayroll] = useState<Payroll | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!payrollId) return
    setLoading(true)
    payrollService.find(payrollId)
      .then(res => setPayroll(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [payrollId])

  const credits = payroll?.items?.filter(i => i.type === 'credit') || []
  const debits = payroll?.items?.filter(i => i.type === 'debit') || []

  return (
    <Modal open={!!payrollId} onClose={onClose} title="Detalhes da Folha" size="lg">
      {loading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      ) : payroll ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-sm text-slate-400">Funcionário</p><p className="text-white font-medium">{payroll.employee?.name}</p></div>
            <div><p className="text-sm text-slate-400">Salário Base</p><p className="text-white">{formatCurrency(Number(payroll.base_salary))}</p></div>
            <div><p className="text-sm text-slate-400">Total Líquido</p><p className="text-primary-400 font-bold">{formatCurrency(Number(payroll.net_salary))}</p></div>
            <div><p className="text-sm text-slate-400">Status</p>
              <span className={`status-badge ${payroll.payment_status === 'paid' ? 'status-active' : 'status-pending'}`}>
                {payroll.payment_status === 'paid' ? 'Pago' : 'Pendente'}
              </span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Créditos</h4>
            {credits.map((item: PayrollItem) => (
              <div key={item.id} className="flex justify-between py-1 text-sm">
                <span className="text-slate-400">{item.description}</span>
                <span className="text-emerald-400">{formatCurrency(Number(item.calculated_amount))}</span>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-300 mb-2">Débitos</h4>
            {debits.map((item: PayrollItem) => (
              <div key={item.id} className="flex justify-between py-1 text-sm">
                <span className="text-slate-400">{item.description}</span>
                <span className="text-red-400">{formatCurrency(Number(item.calculated_amount))}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-slate-400">Dados não disponíveis</p>
      )}
    </Modal>
  )
}
