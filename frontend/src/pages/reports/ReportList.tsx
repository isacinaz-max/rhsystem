import { useState } from 'react'
import { FileText, Download, Loader2 } from 'lucide-react'
import { reportService } from '../../services/reportService'
import PageContainer from '../../components/ui/PageContainer'
import Card from '../../components/ui/Card'
import toast from 'react-hot-toast'

const reportTypes = [
  { key: 'employees', label: 'Relatório de Funcionários', description: 'Lista completa de funcionários com dados cadastrais' },
  { key: 'payroll', label: 'Relatório de Folha', description: 'Detalhamento da folha de pagamento' },
  { key: 'time-records', label: 'Relatório de Ponto', description: 'Registros de ponto e horas trabalhadas' },
  { key: 'vacations', label: 'Relatório de Férias', description: 'Férias solicitadas e aprovadas' },
  { key: 'recruitments', label: 'Relatório de Recrutamento', description: 'Vagas e candidatos em processo' },
]

export default function ReportList() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleGenerate(type: string) {
    setLoading(type)
    try {
      const res = await reportService.generate(type)
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `relatorio-${type}-${new Date().toISOString().split('T')[0]}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Relatório gerado!')
    } catch { toast.error('Erro ao gerar relatório') }
    finally { setLoading(null) }
  }

  return (
    <PageContainer title="Relatórios" subtitle="Gere relatórios em PDF">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => (
          <Card key={report.key}>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{report.label}</h3>
                <p className="text-sm text-slate-400 mt-1">{report.description}</p>
              </div>
              <button
                onClick={() => handleGenerate(report.key)}
                disabled={loading === report.key}
                className="btn-primary flex items-center gap-2 flex-shrink-0"
              >
                {loading === report.key ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Gerar
              </button>
            </div>
          </Card>
        ))}
      </div>
    </PageContainer>
  )
}
