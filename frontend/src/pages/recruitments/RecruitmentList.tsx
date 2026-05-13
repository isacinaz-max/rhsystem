import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { recruitmentService } from '../../services/recruitmentService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import StatusBadge from '../../components/ui/StatusBadge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Recruitment } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function RecruitmentList() {
  const navigate = useNavigate()
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await recruitmentService.list({ per_page: 50 })
      setRecruitments(res.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteId) return
    try {
      await recruitmentService.delete(deleteId)
      toast.success('Vaga removida')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
  }

  return (
    <PageContainer
      title="Recrutamento e Seleção"
      subtitle="Gerencie vagas e processos seletivos"
      actions={
        <button onClick={() => navigate('/recruitments/new')} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Nova Vaga</button>
      }
    >
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={[
            { key: 'position', header: 'Cargo/Vaga', render: (item: Recruitment) => item.position?.name || '-' },
            { key: 'vacancies', header: 'Vagas' },
            { key: 'candidates_count', header: 'Candidatos', render: (item: any) => item.candidates_count || 0 },
            { key: 'salary_range', header: 'Faixa Salarial', render: (item: Recruitment) => item.salary_range || '-' },
            { key: 'status', header: 'Status', render: (item: Recruitment) => <StatusBadge status={item.status} /> },
          ]}
          data={recruitments}
          loading={loading}
          actions={(item: Recruitment) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => navigate(`/recruitments/${item.id}/edit`)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Excluir Vaga" message="Tem certeza?" />
    </PageContainer>
  )
}
