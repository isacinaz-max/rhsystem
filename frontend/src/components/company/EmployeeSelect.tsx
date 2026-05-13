import { useEffect, useState } from 'react'
import { employeeService } from '../../services/employeeService'
import { Employee } from '../../types'

interface EmployeeSelectProps {
  value: string | number
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  companyId?: string | number
}

export default function EmployeeSelect({ value, onChange, placeholder = 'Selecione um funcionário', className = '', companyId }: EmployeeSelectProps) {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await employeeService.listAll()
        setEmployees(res.data.data || [])
      } catch {
        setEmployees([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className={`input-field ${className}`}>
      <option value="">{loading ? 'Carregando...' : placeholder}</option>
      {employees.map((emp) => (
        <option key={emp.id} value={emp.id}>{emp.name} - {emp.cpf}</option>
      ))}
    </select>
  )
}
