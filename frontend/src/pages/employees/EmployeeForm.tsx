import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { SkeletonCard } from '../../components/ui/Skeleton'
import PageContainer from '../../components/ui/PageContainer'
import { employeeService } from '../../services/employeeService'
import { departmentService } from '../../services/departmentService'
import { positionService } from '../../services/positionService'
import { companyService } from '../../services/companyService'
import { Department, Position, Company } from '../../types'
import toast from 'react-hot-toast'

interface FormData {
  name: string
  cpf: string
  rg: string
  birth_date: string
  gender: string
  marital_status: string
  email: string
  phone: string
  zip_code: string
  city: string
  state: string
  neighborhood: string
  street: string
  number: string
  complement: string
  company_id: string
  position_id: string
  department_id: string
  salary: string
  hire_date: string
  status: string
  notes: string
}

export default function EmployeeForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditing)
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>()

  useEffect(() => {
    async function loadData() {
      try {
        const [deptRes, posRes, compRes] = await Promise.all([
          departmentService.list({ per_page: 100 }),
          positionService.list({ per_page: 100 }),
          companyService.listAll(),
        ])
        setDepartments(deptRes.data.data)
        setPositions(posRes.data.data)
        setCompanies(compRes.data.data || compRes.data)

        if (isEditing) {
          const empRes = await employeeService.find(Number(id))
          const emp = empRes.data.data
          if (emp.photo_url) setPhotoPreview(emp.photo_url)
          reset({
            name: emp.name,
            cpf: emp.cpf,
            rg: emp.rg || '',
            birth_date: emp.birth_date || '',
            gender: emp.gender || '',
            marital_status: emp.marital_status || '',
            email: emp.email || '',
            phone: emp.phone || '',
            zip_code: emp.zip_code || '',
            city: emp.city || '',
            state: emp.state || '',
            neighborhood: emp.neighborhood || '',
            street: emp.street || '',
            number: emp.number || '',
            complement: emp.complement || '',
            company_id: emp.company_id?.toString() || '',
            position_id: emp.position_id?.toString() || '',
            department_id: emp.department_id?.toString() || '',
            salary: emp.salary.toString(),
            hire_date: emp.hire_date || '',
            status: emp.status,
            notes: emp.notes || '',
          })
        }
      } catch {
        toast.error('Erro ao carregar dados')
      } finally {
        setPageLoading(false)
      }
    }
    loadData()
  }, [id, isEditing, reset])

  async function onSubmit(data: FormData) {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value)
      })
      if (photoFile) formData.append('photo', photoFile)

      if (isEditing) {
        await employeeService.update(Number(id), formData)
        toast.success('Funcionário atualizado com sucesso')
      } else {
        await employeeService.create(formData)
        toast.success('Funcionário cadastrado com sucesso')
      }
      navigate('/employees')
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao salvar funcionário')
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <PageContainer title={isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}>
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/employees')} className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="page-title">{isEditing ? 'Editar Funcionário' : 'Novo Funcionário'}</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Nome Completo *</label>
              <input {...register('name', { required: true })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">CPF *</label>
              <input {...register('cpf', { required: true })} className="input-field" placeholder="000.000.000-00" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">RG</label>
              <input {...register('rg')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Data Nascimento</label>
              <input type="date" {...register('birth_date')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Sexo</label>
              <select {...register('gender')} className="input-field">
                <option value="">Selecione</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Estado Civil</label>
              <select {...register('marital_status')} className="input-field">
                <option value="">Selecione</option>
                <option value="solteiro">Solteiro</option>
                <option value="casado">Casado</option>
                <option value="divorciado">Divorciado</option>
                <option value="viuvo">Viúvo</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Email</label>
              <input type="email" {...register('email')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Telefone</label>
              <input {...register('phone')} className="input-field" placeholder="(00) 00000-0000" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">CEP</label>
              <input {...register('zip_code')} className="input-field" placeholder="00000-000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Cidade</label>
              <input {...register('city')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Estado</label>
              <input {...register('state')} className="input-field" maxLength={2} placeholder="UF" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Bairro</label>
              <input {...register('neighborhood')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Logradouro</label>
              <input {...register('street')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Número</label>
              <input {...register('number')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Complemento</label>
              <input {...register('complement')} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Dados Profissionais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Empresa *</label>
              <select {...register('company_id', { required: true })} className="input-field">
                <option value="">Selecione</option>
                {companies.map((comp) => (
                  <option key={comp.id} value={comp.id}>{comp.nome_fantasia || comp.razao_social}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Departamento</label>
              <select {...register('department_id')} className="input-field">
                <option value="">Selecione</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Cargo</label>
              <select {...register('position_id')} className="input-field">
                <option value="">Selecione</option>
                {positions.map((pos) => (
                  <option key={pos.id} value={pos.id}>{pos.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Salário (R$)</label>
              <input type="number" step="0.01" {...register('salary')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Data Admissão</label>
              <input type="date" {...register('hire_date')} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-slate-400 mb-1">Status</label>
              <select {...register('status')} className="input-field">
                <option value="ativo">Ativo</option>
                <option value="afastado">Afastado</option>
                <option value="ferias">Férias</option>
                <option value="desligado">Desligado</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Foto</label>
              {photoPreview && (
                <div className="mb-2">
                  <img src={photoPreview} alt="Preview" className="w-20 h-20 rounded-full object-cover bg-slate-700" />
                </div>
              )}
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0] || null
                setPhotoFile(file)
                if (file) setPhotoPreview(URL.createObjectURL(file))
              }} className="input-field" />
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Observações</h3>
          <textarea {...register('notes')} rows={4} className="input-field" />
        </div>

        <div className="flex items-center justify-end gap-3">
          <button type="button" onClick={() => navigate('/employees')} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            <Save className="w-4 h-4" />
            {isEditing ? 'Atualizar' : 'Salvar'}
          </button>
        </div>
      </form>
    </PageContainer>
  )
}
