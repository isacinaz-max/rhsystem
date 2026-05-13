import { useNavigate } from 'react-router-dom'
import { Eye, CheckCircle, FileText } from 'lucide-react'
import DataTable from '../ui/DataTable'
import { Payroll } from '../../types'
import { formatCurrency, formatMonthYear } from '../../utils/formatters'

interface PayrollTableProps {
  payrolls: Payroll[]
  loading: boolean
  meta?: any
  onPageChange?: (page: number) => void
  onMarkAsPaid?: (id: number) => void
  onGeneratePdf?: (id: number) => void
}

export default function PayrollTable({ payrolls, loading, meta, onPageChange, onMarkAsPaid, onGeneratePdf }: PayrollTableProps) {
  const navigate = useNavigate()

  const columns = [
    {
      key: 'employee',
      header: 'Funcionário',
      render: (item: Payroll) => item.employee?.name || '-',
    },
    {
      key: 'competence',
      header: 'Competência',
      render: (item: Payroll) => item.competence || formatMonthYear(item.reference_month, item.reference_year),
    },
    {
      key: 'base_salary',
      header: 'Salário Base',
      render: (item: Payroll) => formatCurrency(Number(item.base_salary)),
    },
    {
      key: 'total_credit',
      header: 'Créditos',
      render: (item: Payroll) => formatCurrency(Number(item.total_credit || 0)),
    },
    {
      key: 'total_debit',
      header: 'Débitos',
      render: (item: Payroll) => formatCurrency(Number(item.total_debit || 0)),
    },
    {
      key: 'net_salary',
      header: 'Líquido',
      render: (item: Payroll) => formatCurrency(Number(item.net_salary)),
    },
    {
      key: 'payment_status',
      header: 'Status',
      render: (item: Payroll) => (
        <span className={`status-badge ${item.payment_status === 'paid' ? 'status-active' : item.payment_status === 'canceled' ? 'status-inactive' : 'status-pending'}`}>
          {item.payment_status === 'paid' ? 'Pago' : item.payment_status === 'canceled' ? 'Cancelado' : 'Pendente'}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={payrolls}
      loading={loading}
      meta={meta}
      onPageChange={onPageChange}
      actions={(item: Payroll) => (
        <div className="flex items-center justify-end gap-2">
          <button onClick={() => navigate(`/payroll/${item.id}`)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white" title="Detalhes">
            <Eye className="w-4 h-4" />
          </button>
          {item.payment_status !== 'paid' && onMarkAsPaid && (
            <button onClick={() => onMarkAsPaid(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 hover:text-emerald-300" title="Marcar como pago">
              <CheckCircle className="w-4 h-4" />
            </button>
          )}
          {onGeneratePdf && (
            <button onClick={() => onGeneratePdf(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white" title="Download PDF">
              <FileText className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    />
  )
}
