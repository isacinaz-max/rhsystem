import { useEffect, useState } from 'react'
import { Users, UserCheck, UserX, DollarSign, Clock } from 'lucide-react'
import { dashboardService } from '../services/dashboardService'
import DashboardCard from '../components/ui/DashboardCard'
import Loading from '../components/ui/Loading'
import PageContainer from '../components/ui/PageContainer'
import BarChartCard from '../components/charts/BarChartCard'
import PieChartCard from '../components/charts/PieChartCard'
import { DashboardIndicators, DashboardCharts } from '../types'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const [indicators, setIndicators] = useState<DashboardIndicators | null>(null)
  const [charts, setCharts] = useState<DashboardCharts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [indRes, chartRes] = await Promise.all([
          dashboardService.getIndicators(),
          dashboardService.getCharts(),
        ])
        if (cancelled) return
        setIndicators(indRes.data.data)
        setCharts(chartRes.data.data)
      } catch (error) {
        console.error('Erro ao carregar dashboard:', error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  if (loading) return <Loading text="Carregando dashboard..." />

  return (
    <PageContainer>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard
          title="Total Funcionários"
          value={indicators?.total_employees || 0}
          icon={<Users className="w-6 h-6" />}
          color="primary"
        />
        <DashboardCard
          title="Funcionários Ativos"
          value={indicators?.active_employees || 0}
          icon={<UserCheck className="w-6 h-6" />}
          color="green"
        />
        <DashboardCard
          title="Funcionários Afastados"
          value={indicators?.inactive_employees || 0}
          icon={<UserX className="w-6 h-6" />}
          color="red"
        />
        <DashboardCard
          title="Folha de Pagamento"
          value={formatCurrency(indicators?.total_costs || 0)}
          icon={<DollarSign className="w-6 h-6" />}
          color="blue"
        />
        <DashboardCard
          title="Horas Extras (mês)"
          value={`${Math.round((indicators?.overtime_minutes || 0) / 60)}h`}
          icon={<Clock className="w-6 h-6" />}
          color="yellow"
        />
        <DashboardCard
          title="Turnover"
          value={`${indicators?.turnover_rate || 0}%`}
          icon={<Users className="w-6 h-6" />}
          color="purple"
        />
      </div>

      {indicators && indicators.birthdays_current_month > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-pink-500" />
            <h3 className="text-lg font-semibold text-white">Aniversariantes do Mês</h3>
          </div>
          <p className="text-slate-400">{indicators.birthdays_current_month} aniversariante(s) este mês</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {charts?.employees_by_department && charts.employees_by_department.length > 0 && (
          <BarChartCard
            title="Funcionários por Departamento"
            data={charts.employees_by_department.map(item => ({ name: item.department, value: item.count }))}
          />
        )}
        {charts?.salary_distribution && charts.salary_distribution.length > 0 && (
          <PieChartCard
            title="Distribuição Salarial"
            data={charts.salary_distribution.map(item => ({ name: item.range, value: item.count }))}
          />
        )}
        {charts?.spending_by_department && charts.spending_by_department.length > 0 && (
          <BarChartCard
            title="Gastos por Departamento"
            data={charts.spending_by_department.map(item => ({ name: item.department, value: item.total }))}
            formatValue={formatCurrency}
          />
        )}
        {charts?.spending_by_position && charts.spending_by_position.length > 0 && (
          <BarChartCard
            title="Gastos por Cargo"
            data={charts.spending_by_position.map(item => ({ name: item.position, value: item.total }))}
            formatValue={formatCurrency}
          />
        )}
      </div>
    </PageContainer>
  )
}
