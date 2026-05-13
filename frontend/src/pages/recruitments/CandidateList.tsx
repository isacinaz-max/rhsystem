import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { candidateService } from '../../services/candidateService'
import { recruitmentService } from '../../services/recruitmentService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import StatusBadge from '../../components/ui/StatusBadge'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { Candidate, Recruitment } from '../../types'
import { formatCurrency } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function CandidateList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [recruitments, setRecruitments] = useState<Recruitment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [recruitmentFilter, setRecruitmentFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', salary_expectation: '', status: '', recruitment_id: '' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { per_page: 50 }
      if (search) params.search = search
      if (recruitmentFilter) params.recruitment_id = recruitmentFilter
      const [candRes, recRes] = await Promise.all([
        candidateService.list(params),
        recruitmentService.list({ per_page: 100 }),
      ])
      setCandidates(candRes.data.data)
      setRecruitments(recRes.data.data)
    } catch { toast.error('Erro ao carregar') }
    finally { setLoading(false) }
  }, [search, recruitmentFilter])

  useEffect(() => { load() }, [load])

  function openCreate() {
    setEditingCandidate(null)
    setFormData({ name: '', email: '', phone: '', salary_expectation: '', status: 'novo', recruitment_id: '' })
    setModalOpen(true)
  }

  function openEdit(candidate: Candidate) {
    setEditingCandidate(candidate)
    setFormData({
      name: candidate.name,
      email: candidate.email || '',
      phone: candidate.phone || '',
      salary_expectation: candidate.salary_expectation?.toString() || '',
      status: candidate.status,
      recruitment_id: candidate.recruitment_id?.toString() || '',
    })
    setModalOpen(true)
  }

  async function handleSave() {
    try {
      const data = { ...formData, salary_expectation: Number(formData.salary_expectation) }
      if (editingCandidate) {
        await candidateService.update(editingCandidate.id, data)
        toast.success('Candidato atualizado')
      } else {
        await candidateService.create(data)
        toast.success('Candidato criado')
      }
      setModalOpen(false)
      load()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar')
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await candidateService.delete(deleteId)
      toast.success('Candidato removido')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover') }
  }

  return (
    <PageContainer
      title="Candidatos"
      actions={
        <button onClick={openCreate} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Novo</button>
      }
    >
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1"><SearchInput value={search} onChange={(v) => setSearch(v)} placeholder="Buscar candidato..." /></div>
          <select value={recruitmentFilter} onChange={(e) => setRecruitmentFilter(e.target.value)} className="input-field w-48">
            <option value="">Todas as vagas</option>
            {recruitments.map((r) => <option key={r.id} value={r.id}>{r.position?.name || `Vaga #${r.id}`}</option>)}
          </select>
        </div>
      </div>
      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={[
            { key: 'name', header: 'Nome' },
            { key: 'email', header: 'Email', render: (item: Candidate) => item.email || '-' },
            { key: 'phone', header: 'Telefone', render: (item: Candidate) => item.phone || '-' },
            { key: 'recruitment', header: 'Vaga', render: (item: Candidate) => item.recruitment?.position?.name || '-' },
            { key: 'salary_expectation', header: 'Pretensão', render: (item: Candidate) => item.salary_expectation ? formatCurrency(item.salary_expectation) : '-' },
            { key: 'status', header: 'Status', render: (item: Candidate) => <StatusBadge status={item.status} /> },
          ]}
          data={candidates}
          loading={loading}
          actions={(item: Candidate) => (
            <div className="flex gap-2 justify-end">
              <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingCandidate ? 'Editar Candidato' : 'Novo Candidato'}>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Nome *</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Telefone</label><input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Vaga</label>
            <select value={formData.recruitment_id} onChange={(e) => setFormData({ ...formData, recruitment_id: e.target.value })} className="input-field">
              <option value="">Selecione</option>
              {recruitments.map((r) => <option key={r.id} value={r.id}>{r.position?.name || `Vaga #${r.id}`}</option>)}
            </select>
          </div>
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Pretensão Salarial (R$)</label><input type="number" step="0.01" value={formData.salary_expectation} onChange={(e) => setFormData({ ...formData, salary_expectation: e.target.value })} className="input-field" /></div>
          <div><label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
            <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="input-field">
              <option value="novo">Novo</option>
              <option value="contatado">Contatado</option>
              <option value="entrevistado">Entrevistado</option>
              <option value="aprovado">Aprovado</option>
              <option value="recusado">Recusado</option>
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancelar</button>
            <button onClick={handleSave} className="btn-primary">Salvar</button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete} title="Excluir Candidato" message="Tem certeza?" />
    </PageContainer>
  )
}
