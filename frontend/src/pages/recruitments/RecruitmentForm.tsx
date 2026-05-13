import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { recruitmentService } from '../../services/recruitmentService'
import { positionService } from '../../services/positionService'
import PageContainer from '../../components/ui/PageContainer'
import { Position } from '../../types'
import toast from 'react-hot-toast'

export default function RecruitmentForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [positions, setPositions] = useState<Position[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    position_id: '', vacancies: 1, salary_range: '', status: 'aberta', description: '', requirements: '',
  })

  useEffect(() => {
    positionService.list({ per_page: 100 }).then((res) => setPositions(res.data.data)).catch(() => {})
    if (isEditing) {
      recruitmentService.find(Number(id)).then((res) => {
        const d = res.data.data
        setFormData({
          position_id: d.position_id?.toString() || '',
          vacancies: d.vacancies,
          salary_range: d.salary_range || '',
          status: d.status,
          description: d.description || '',
          requirements: d.requirements || '',
        })
      }).catch(() => toast.error('Erro ao carregar'))
    }
  }, [id, isEditing])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (isEditing) {
        await recruitmentService.update(Number(id), formData)
        toast.success('Vaga atualizada')
      } else {
        await recruitmentService.create(formData)
        toast.success('Vaga criada')
      }
      navigate('/recruitments')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/recruitments')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="page-title">{isEditing ? 'Editar Vaga' : 'Nova Vaga'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Cargo</label>
            <select value={formData.position_id} onChange={(e) => setFormData({ ...formData, position_id: e.target.value })} className="input-field">
              <option value="">Selecione</option>
              {positions.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Nº de Vagas</label>
            <input type="number" min={1} value={formData.vacancies} onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Faixa Salarial</label>
            <input value={formData.salary_range} onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })} className="input-field" placeholder="Ex: R$ 3.000 - R$ 5.000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Descrição</label>
            <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Requisitos</label>
            <textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows={3} className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field">
              <option value="aberta">Aberta</option>
              <option value="andamento">Em Andamento</option>
              <option value="fechada">Fechada</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => navigate('/recruitments')} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" /> {isEditing ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </div>
      </form>
    </PageContainer>
  )
}
