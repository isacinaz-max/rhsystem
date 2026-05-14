import { useEffect, useState, useCallback } from 'react'
import { FileText, Loader2, Trash2 } from 'lucide-react'
import { payrollService } from '../../services/payrollService'
import PayrollTable from '../../components/payroll/PayrollTable'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import CompanySelect from '../../components/company/CompanySelect'
import EmployeeSelect from '../../components/company/EmployeeSelect'
import { Payroll } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import toast from 'react-hot-toast'

export default function PayrollList() {
  const [payrolls, setPayrolls] = useState<Payroll[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())
  const [companyFilter, setCompanyFilter] = useState('')
  const [employeeFilter, setEmployeeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { reference_month: month, reference_year: year, page, per_page: 15 }
      if (companyFilter) params.company_id = companyFilter
      if (employeeFilter) params.employee_id = employeeFilter
      if (statusFilter) params.payment_status = statusFilter
      const res = await payrollService.list(params)
      setPayrolls(res.data.data)
      setMeta(res.data.meta)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [month, year, companyFilter, employeeFilter, statusFilter, page])

  useEffect(() => { load() }, [load])

  const totalBase = payrolls.reduce((acc, p) => acc + Number(p.base_salary), 0)
  const totalCredit = payrolls.reduce((acc, p) => acc + Number(p.total_credit || 0), 0)
  const totalDebit = payrolls.reduce((acc, p) => acc + Number(p.total_debit || 0), 0)
  const totalNet = payrolls.reduce((acc, p) => acc + Number(p.net_salary), 0)

  async function handleGenerate() {
    setGenerating(true)
    try {
      const payload: any = { reference_month: month, reference_year: year }
      if (employeeFilter) payload.employee_id = employeeFilter
      if (companyFilter) payload.company_id = companyFilter
      await payrollService.generate(payload)
      toast.success('Folha gerada com sucesso!')
      load()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao gerar')
    } finally {
      setGenerating(false)
    }
  }

  async function handleMarkAsPaid(id: number) {
    try {
      await payrollService.markAsPaid(id)
      toast.success('Folha marcada como paga')
      load()
    } catch { toast.error('Erro ao marcar como paga') }
  }

  async function handleGeneratePdf(id: number) {
    try {
      const res = await payrollService.generatePdf(id)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `holerite-${id}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch { toast.error('Erro ao gerar PDF') }
  }

  async function handleDelete(id: number) {
    try {
      await payrollService.delete(id)
      toast.success('Folha removida com sucesso')
      load()
    } catch { toast.error('Erro ao remover folha') }
    finally { setDeleteId(null) }
  }

  return (
    <PageContainer
      title="Folha de Pagamento"
      subtitle="Gerenciamento de folha de pagamento e holerites"
    >
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card><p className="text-sm text-gray-500 dark:text-slate-400">Total Bruto</p><p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalBase)}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-slate-400">Total Créditos</p><p className="text-xl font-bold text-emerald-400">{formatCurrency(totalCredit)}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-slate-400">Total Débitos</p><p className="text-xl font-bold text-red-400">{formatCurrency(totalDebit)}</p></Card>
        <Card><p className="text-sm text-gray-500 dark:text-slate-400">Total Líquido</p><p className="text-xl font-bold text-primary-400">{formatCurrency(totalNet)}</p></Card>
      </div>

      <div className="card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex gap-2 flex-1">
            <select value={month} onChange={(e) => { setMonth(Number(e.target.value)); setPage(1) }} className="input-field w-40">
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}</option>
              ))}
            </select>
            <select value={year} onChange={(e) => { setYear(Number(e.target.value)); setPage(1) }} className="input-field w-28">
              {[2024, 2025, 2026, 2027].map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
           <CompanySelect value={companyFilter} onChange={(v) => { setCompanyFilter(v); setPage(1) }} placeholder="Filtrar por empresa" allOption className="w-48" />
          <EmployeeSelect value={employeeFilter} onChange={(v) => { setEmployeeFilter(v); setPage(1) }} placeholder="Filtrar por funcionário" className="w-48" />
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className="input-field w-36">
            <option value="">Todos status</option>
            <option value="pending">Pendente</option>
            <option value="paid">Pago</option>
            <option value="canceled">Cancelado</option>
          </select>
          <button onClick={handleGenerate} disabled={generating} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            {generating && <Loader2 className="w-4 h-4 animate-spin" />}
            <FileText className="w-4 h-4" /> Gerar Folha
          </button>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <PayrollTable
          payrolls={payrolls}
          loading={loading}
          meta={meta}
          onPageChange={setPage}
          onMarkAsPaid={handleMarkAsPaid}
          onGeneratePdf={handleGeneratePdf}
          onDelete={(id) => setDeleteId(id)}
        />
      </div>
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && handleDelete(deleteId)}
        title="Remover Folha"
        message="Tem certeza que deseja remover esta folha de pagamento?"
      />
    </PageContainer>
  )
}
