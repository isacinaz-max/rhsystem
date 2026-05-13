import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, ThumbsUp, ThumbsDown } from 'lucide-react'
import { vacationService } from '../../services/vacationService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Vacation } from '../../types'
import { formatDate } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function VacationList() {
  const navigate = useNavigate()
  const [vacations, setVacations] = useState<Vacation[]>([])
  const [loading, setLoading] = useState(true)
  const [approveId, setApproveId] = useState<number | null>(null)
  const [rejectId, setRejectId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await vacationService.list({ per_page: 50 })
      setVacations(res.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleApprove() {
    if (!approveId) return
    try {
      await vacationService.approve(approveId)
      toast.success('Férias aprovadas!')
      setApproveId(null)
      load()
    } catch { toast.error('Erro ao aprovar') }
  }

  async function handleReject() {
    if (!rejectId) return
    try {
      await vacationService.reject(rejectId)
      toast.success('Férias rejeitadas')
      setRejectId(null)
      load()
    } catch { toast.error('Erro ao rejeitar') }
  }

  return (
    <PageContainer
      title="Férias"
      subtitle="Solicitação e aprovação de férias"
      actions={
        <button onClick={() => navigate('/vacations/new')} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Solicitar Férias
        </button>
      }
    >
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={[
            { key: 'employee', header: 'Funcionário', render: (item: Vacation) => item.employee?.name || '-' },
            { key: 'start_date', header: 'Início', render: (item: Vacation) => formatDate(item.start_date) },
            { key: 'end_date', header: 'Fim', render: (item: Vacation) => formatDate(item.end_date) },
            { key: 'days', header: 'Dias', render: (item: Vacation) => item.days },
            { key: 'status', header: 'Status', render: (item: Vacation) => <StatusBadge status={item.status} /> },
          ]}
          data={vacations}
          loading={loading}
          actions={(item: Vacation) => (
            <div className="flex gap-2 justify-end">
              {item.status === 'pendente' && (
                <>
                  <button onClick={() => setApproveId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-emerald-400 hover:text-emerald-300">
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => setRejectId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300">
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          )}
        />
      </div>

      <ConfirmDialog open={!!approveId} onClose={() => setApproveId(null)} onConfirm={handleApprove} title="Aprovar Férias" message="Confirmar aprovação?" />
      <ConfirmDialog open={!!rejectId} onClose={() => setRejectId(null)} onConfirm={handleReject} title="Rejeitar Férias" message="Confirmar rejeição?" />
    </PageContainer>
  )
}
