import { useEffect, useState, useCallback } from 'react'
import { Plus, Edit2, Trash2, Eye, Building2 } from 'lucide-react'
import { companyService } from '../../services/companyService'
import DataTable from '../../components/ui/DataTable'
import PageContainer from '../../components/ui/PageContainer'
import SearchInput from '../../components/ui/SearchInput'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import Modal from '../../components/ui/Modal'
import { Company } from '../../types'
import { formatCNPJ, formatPhone } from '../../utils/formatters'
import toast from 'react-hot-toast'

export default function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [meta, setMeta] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [viewCompany, setViewCompany] = useState<Company | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editCompany, setEditCompany] = useState<Company | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params: any = { page, per_page: 15 }
      if (search) params.search = search
      const response = await companyService.list(params)
      setCompanies(response.data.data)
      setMeta(response.data.meta)
    } catch { toast.error('Erro ao carregar empresas') }
    finally { setLoading(false) }
  }, [page, search])

  useEffect(() => { load() }, [load])

  async function handleDelete() {
    if (!deleteId) return
    setDeleting(true)
    try {
      await companyService.delete(deleteId)
      toast.success('Empresa removida com sucesso')
      setDeleteId(null)
      load()
    } catch { toast.error('Erro ao remover empresa') }
    finally { setDeleting(false) }
  }

  function handleEdit(company: Company) {
    setEditCompany(company)
    setShowForm(true)
  }

  function handleFormClose() {
    setShowForm(false)
    setEditCompany(null)
  }

  const columns = [
    { key: 'nome_fantasia', header: 'Nome Fantasia', render: (item: Company) => item.nome_fantasia || '-' },
    { key: 'razao_social', header: 'Razão Social', render: (item: Company) => item.razao_social || '-' },
    { key: 'cnpj', header: 'CNPJ', render: (item: Company) => item.cnpj || '-' },
    { key: 'cidade', header: 'Cidade', render: (item: Company) => item.cidade || '-' },
    { key: 'estado', header: 'UF', render: (item: Company) => item.estado || '-' },
    { key: 'status', header: 'Status', render: (item: Company) => (
      <span className={`status-badge ${item.is_active ? 'status-active' : 'status-inactive'}`}>
        {item.is_active ? 'Ativo' : 'Inativo'}
      </span>
    )},
  ]

  return (
    <PageContainer
      title="Empresas"
      subtitle="Gerencie todas as empresas do sistema"
      actions={
        <button onClick={() => setShowForm(true)} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Nova Empresa
        </button>
      }
    >
      <div className="card">
        <SearchInput value={search} onChange={(v) => { setSearch(v); setPage(1) }} placeholder="Buscar por nome, razão social ou CNPJ..." />
      </div>

      <div className="card p-0 overflow-hidden">
        <DataTable
          columns={columns}
          data={companies}
          loading={loading}
          meta={meta}
          onPageChange={setPage}
          actions={(item: Company) => (
            <div className="flex items-center justify-end gap-2">
              <button onClick={() => setViewCompany(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                <Eye className="w-4 h-4" />
              </button>
              <button onClick={() => handleEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-800 text-blue-400 hover:text-blue-300">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => setDeleteId(item.id)} className="p-1.5 rounded-lg hover:bg-slate-800 text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        />
      </div>

      <Modal open={showForm} onClose={handleFormClose} title={editCompany ? 'Editar Empresa' : 'Nova Empresa'} size="lg">
        <CompanyForm company={editCompany} onSave={() => { handleFormClose(); load() }} onCancel={handleFormClose} />
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Empresa"
        message="Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita."
        loading={deleting}
      />

      <Modal open={!!viewCompany} onClose={() => setViewCompany(null)} title="Detalhes da Empresa" size="lg">
        {viewCompany && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-slate-400">Razão Social</p><p className="text-white font-medium">{viewCompany.razao_social}</p></div>
              <div><p className="text-sm text-slate-400">Nome Fantasia</p><p className="text-white">{viewCompany.nome_fantasia || '-'}</p></div>
              <div><p className="text-sm text-slate-400">CNPJ</p><p className="text-white">{viewCompany.cnpj}</p></div>
              <div><p className="text-sm text-slate-400">Inscrição Estadual</p><p className="text-white">{viewCompany.inscricao_estadual || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Telefone</p><p className="text-white">{viewCompany.telefone || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Email</p><p className="text-white">{viewCompany.email || '-'}</p></div>
              <div><p className="text-sm text-slate-400">CEP</p><p className="text-white">{viewCompany.cep || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Endereço</p><p className="text-white">{viewCompany.endereco || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Número</p><p className="text-white">{viewCompany.numero || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Bairro</p><p className="text-white">{viewCompany.bairro || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Cidade</p><p className="text-white">{viewCompany.cidade || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Estado</p><p className="text-white">{viewCompany.estado || '-'}</p></div>
              <div><p className="text-sm text-slate-400">Status</p>
                <span className={`status-badge ${viewCompany.is_active ? 'status-active' : 'status-inactive'}`}>
                  {viewCompany.is_active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              {viewCompany.employees_count !== undefined && (
                <div><p className="text-sm text-slate-400">Funcionários</p><p className="text-white">{viewCompany.employees_count}</p></div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  )
}

function CompanyForm({ company, onSave, onCancel }: { company: Company | null; onSave: () => void; onCancel: () => void }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    razao_social: company?.razao_social || '',
    nome_fantasia: company?.nome_fantasia || '',
    cnpj: company?.cnpj || '',
    inscricao_estadual: company?.inscricao_estadual || '',
    telefone: company?.telefone || '',
    email: company?.email || '',
    cep: company?.cep || '',
    endereco: company?.endereco || '',
    numero: company?.numero || '',
    bairro: company?.bairro || '',
    cidade: company?.cidade || '',
    estado: company?.estado || '',
    is_active: company?.is_active ?? true,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      if (company) {
        await companyService.update(company.id, form)
        toast.success('Empresa atualizada com sucesso')
      } else {
        await companyService.create(form)
        toast.success('Empresa cadastrada com sucesso')
      }
      onSave()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar empresa')
    } finally { setLoading(false) }
  }

  function handleChange(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Razão Social *</label>
          <input value={form.razao_social} onChange={e => handleChange('razao_social', e.target.value)} required className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Nome Fantasia</label>
          <input value={form.nome_fantasia} onChange={e => handleChange('nome_fantasia', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">CNPJ *</label>
          <input value={form.cnpj} onChange={e => handleChange('cnpj', e.target.value)} required className="input-field" placeholder="00.000.000/0001-00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Inscrição Estadual</label>
          <input value={form.inscricao_estadual} onChange={e => handleChange('inscricao_estadual', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Telefone</label>
          <input value={form.telefone} onChange={e => handleChange('telefone', e.target.value)} className="input-field" placeholder="(00) 00000-0000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
          <input type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">CEP</label>
          <input value={form.cep} onChange={e => handleChange('cep', e.target.value)} className="input-field" placeholder="00000-000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Endereço</label>
          <input value={form.endereco} onChange={e => handleChange('endereco', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Número</label>
          <input value={form.numero} onChange={e => handleChange('numero', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Bairro</label>
          <input value={form.bairro} onChange={e => handleChange('bairro', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Cidade</label>
          <input value={form.cidade} onChange={e => handleChange('cidade', e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Estado</label>
          <input value={form.estado} onChange={e => handleChange('estado', e.target.value)} maxLength={2} className="input-field" placeholder="UF" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={e => handleChange('is_active', e.target.checked)} className="w-4 h-4" />
          <span className="text-sm text-slate-300">Empresa Ativa</span>
        </label>
      </div>
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-700">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancelar</button>
        <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Salvando...' : 'Salvar'}</button>
      </div>
    </form>
  )
}
