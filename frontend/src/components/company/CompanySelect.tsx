import { useEffect, useState } from 'react'
import { companyService } from '../../services/companyService'
import { Company } from '../../types'

interface CompanySelectProps {
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  allOption?: boolean
}

export default function CompanySelect({ value, onChange, placeholder = 'Selecione uma empresa', className = '', allOption = false }: CompanySelectProps) {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await companyService.listAll()
        setCompanies(res.data.data || res.data)
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    load()
  }, [])

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input-field ${className}`}>
      <option value="">{loading ? 'Carregando...' : placeholder}</option>
      {allOption && <option value="">Todas</option>}
      {companies.map((company) => (
        <option key={company.id} value={company.id}>{company.nome_fantasia || company.razao_social}</option>
      ))}
    </select>
  )
}
