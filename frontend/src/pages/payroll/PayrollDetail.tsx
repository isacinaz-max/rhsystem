import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, CheckCircle, RefreshCw, Loader2 } from 'lucide-react'
import { payrollService } from '../../services/payrollService'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import { Payroll, PayrollItem } from '../../types'
import { formatCurrency, formatDate, formatMonthYear } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function PayrollDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [payroll, setPayroll] = useState<Payroll | null>(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [recalculating, setRecalculating] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await payrollService.find(Number(id))
        setPayroll(res.data.data)
      } catch { toast.error('Erro ao carregar folha') }
      finally { setLoading(false) }
    }
    load()
  }, [id])

  async function handleMarkAsPaid() {
    setPaying(true)
    try {
      await payrollService.markAsPaid(Number(id))
      toast.success('Folha marcada como paga')
      const res = await payrollService.find(Number(id))
      setPayroll(res.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao marcar como paga')
    } finally { setPaying(false) }
  }

  async function handleRecalculate() {
    setRecalculating(true)
    try {
      await payrollService.recalculate(Number(id))
      toast.success('Folha recalculada com sucesso')
      const res = await payrollService.find(Number(id))
      setPayroll(res.data.data)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao recalcular')
    } finally { setRecalculating(false) }
  }

  if (loading) {
    return (
      <PageContainer title="Detalhes da Folha">
        <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-slate-400" /></div>
      </PageContainer>
    )
  }

  if (!payroll) {
    return (
      <PageContainer title="Detalhes da Folha">
        <p className="text-slate-400">Folha não encontrada</p>
      </PageContainer>
    )
  }

  const credits = payroll.items?.filter(i => i.type === 'credit') || []
  const debits = payroll.items?.filter(i => i.type === 'debit') || []

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/payroll')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="page-title">Detalhes da Folha</h1>
            <p className="text-sm text-slate-400">
              {payroll.employee?.name} - {payroll.competence || formatMonthYear(payroll.reference_month, payroll.reference_year)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleRecalculate} disabled={recalculating} className="btn-secondary flex items-center gap-2">
            {recalculating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Recalcular
          </button>
          {payroll.payment_status !== 'paid' && (
            <button onClick={handleMarkAsPaid} disabled={paying} className="btn-primary flex items-center gap-2">
              {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              Marcar como Pago
            </button>
          )}
          <button onClick={() => navigate(`/payroll/${id}/edit`)} className="btn-primary flex items-center gap-2">
            <FileText className="w-4 h-4" /> Editar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <Card>
          <p className="text-sm text-gray-500 dark:text-slate-400">Salário Base</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(Number(payroll.base_salary))}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Créditos</p>
          <p className="text-xl font-bold text-emerald-400">{formatCurrency(Number(payroll.total_credit || 0))}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Débitos</p>
          <p className="text-xl font-bold text-red-400">{formatCurrency(Number(payroll.total_debit || 0))}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500 dark:text-slate-400">Salário Líquido</p>
          <p className="text-xl font-bold text-primary-400">{formatCurrency(Number(payroll.net_salary))}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Créditos</h3>
          {credits.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-sm">Nenhum crédito</p>
          ) : (
            <div className="space-y-3">
              {credits.map((item: PayrollItem) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{item.description}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {item.calculation_type === 'fixed'
                        ? `Valor fixo: ${formatCurrency(Number(item.amount))}`
                        : `${item.percentage}% ${item.amount > 0 ? `de ${formatCurrency(Number(item.amount))}` : 'do salário base'}`
                      }
                    </p>
                  </div>
                  <p className="text-emerald-400 font-semibold">{formatCurrency(Number(item.calculated_amount))}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-slate-600">
                <p className="text-gray-900 dark:text-white font-semibold">Total Créditos</p>
                <p className="text-emerald-400 font-bold text-lg">{formatCurrency(Number(payroll.total_credit || 0))}</p>
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Débitos</h3>
          {debits.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-sm">Nenhum débito</p>
          ) : (
            <div className="space-y-3">
              {debits.map((item: PayrollItem) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-slate-700 last:border-0">
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{item.description}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {item.calculation_type === 'fixed'
                        ? `Valor fixo: ${formatCurrency(Number(item.amount))}`
                        : `${item.percentage}% ${item.amount > 0 ? `de ${formatCurrency(Number(item.amount))}` : 'do salário base'}`
                      }
                    </p>
                  </div>
                  <p className="text-red-400 font-semibold">{formatCurrency(Number(item.calculated_amount))}</p>
                </div>
              ))}
              <div className="flex items-center justify-between pt-2 border-t border-gray-300 dark:border-slate-600">
                <p className="text-gray-900 dark:text-white font-semibold">Total Débitos</p>
                <p className="text-red-400 font-bold text-lg">{formatCurrency(Number(payroll.total_debit || 0))}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card mt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumo</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Status</p>
            <span className={`status-badge ${payroll.payment_status === 'paid' ? 'status-active' : payroll.payment_status === 'canceled' ? 'status-inactive' : 'status-pending'}`}>
              {payroll.payment_status === 'paid' ? 'Pago' : payroll.payment_status === 'canceled' ? 'Cancelado' : 'Pendente'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">Data Pagamento</p>
            <p className="text-gray-900 dark:text-white">{payroll.payment_date ? formatDate(payroll.payment_date) : '-'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-slate-400">FGTS</p>
            <p className="text-gray-900 dark:text-white">{formatCurrency(Number(payroll.fgts))}</p>
          </div>
        </div>
        {payroll.observations && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Observações</p>
            <p className="text-gray-900 dark:text-white">{payroll.observations}</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}
