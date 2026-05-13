import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { vacationService } from '../../services/vacationService'
import { employeeService } from '../../services/employeeService'
import PageContainer from '../../components/ui/PageContainer'
import { Employee } from '../../types'
import toast from 'react-hot-toast'

export default function VacationForm() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeId, setEmployeeId] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    employeeService.list({ per_page: 100 }).then((res) => setEmployees(res.data.data)).catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!employeeId || !startDate || !endDate) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await vacationService.create({ employee_id: Number(employeeId), start_date: startDate, end_date: endDate })
      toast.success('Férias solicitadas!')
      navigate('/vacations')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao solicitar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/vacations')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="page-title">Solicitar Férias</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Funcionário</label>
            <select value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className="input-field">
              <option value="">Selecione</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Data Início</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Data Fim</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/vacations')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" /> Solicitar
            </button>
          </div>
        </div>
      </form>
    </PageContainer>
  )
}
