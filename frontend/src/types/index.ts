export interface User {
  id: number
  name: string
  email: string
  role: 'administrador' | 'rh' | 'gestor' | 'funcionario'
  permissions?: string[]
  is_active: boolean
  is_super_admin?: boolean
  company_id?: number
  employee_id?: number
  employee?: Employee
}

export interface Employee {
  id: number
  name: string
  cpf: string
  rg?: string
  birth_date?: string
  gender?: string
  marital_status?: string
  email?: string
  phone?: string
  address?: string
  zip_code?: string
  city?: string
  state?: string
  neighborhood?: string
  street?: string
  number?: string
  complement?: string
  position_id?: number
  department_id?: number
  company_id?: number
  salary: number
  hire_date?: string
  status: 'ativo' | 'afastado' | 'ferias' | 'desligado'
  photo?: string
  photo_url?: string
  notes?: string
  department?: Department
  position?: Position
  company?: Company
  created_at: string
  updated_at: string
}

export interface Company {
  id: number
  razao_social: string
  nome_fantasia?: string
  cnpj: string
  inscricao_estadual?: string
  telefone?: string
  email?: string
  cep?: string
  endereco?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  logo?: string
  status?: string
  is_active: boolean
  employees_count?: number
  created_at: string
  updated_at: string
}

export interface Department {
  id: number
  name: string
  responsible_id?: number
  description?: string
  employees_count?: number
  created_at: string
  updated_at: string
}

export interface Position {
  id: number
  name: string
  base_salary: number
  description?: string
  employees_count?: number
  created_at: string
  updated_at: string
}

export interface Payroll {
  id: number
  employee_id: number
  company_id?: number
  competence?: string
  reference_month: number
  reference_year: number
  base_salary: number
  benefits_total: number
  discounts_total: number
  inss: number
  fgts: number
  irrf: number
  transportation_vouchers: number
  meal_vouchers: number
  net_salary: number
  total_credit?: number
  total_debit?: number
  payment_status?: string
  payment_date?: string
  observations?: string
  status: string
  employee?: Employee
  company?: Company
  items?: PayrollItem[]
  created_at: string
}

export interface PayrollItem {
  id: number
  payroll_id: number
  employee_payroll_item_id?: number
  description: string
  type: 'credit' | 'debit'
  calculation_type: 'fixed' | 'percentage'
  amount: number
  percentage?: number
  calculated_amount: number
  created_at: string
}

export interface EmployeePayrollItem {
  id: number
  employee_id: number
  benefit_id?: number
  description: string
  type: 'credit' | 'debit'
  calculation_type: 'fixed' | 'percentage'
  amount: number
  percentage?: number
  reference_salary: boolean
  active: boolean
  employee?: Employee
  benefit?: Benefit
  created_at: string
  updated_at: string
}

export interface Vacation {
  id: number
  employee_id: number
  start_date: string
  end_date: string
  days: number
  period: string
  status: 'pendente' | 'aprovado' | 'rejeitado'
  approved_by?: number
  approved_at?: string
  notes?: string
  employee?: Employee
  created_at: string
}

export interface TimeRecord {
  id: number
  employee_id: number
  record_date: string
  entry_time?: string
  exit_time?: string
  lunch_start?: string
  lunch_end?: string
  overtime?: number
  bank_hours?: number
  notes?: string
  employee?: Employee
  created_at: string
}

export interface Benefit {
  id: number
  name: string
  value: number
  type: string
  description?: string
  is_active: boolean
  pivot?: { granted_date: string }
  created_at: string
}

export interface Recruitment {
  id: number
  position: string
  description: string
  requirements?: string
  salary_range?: string
  status: string
  open_date: string
  close_date?: string
  candidates_count?: number
  created_at: string
}

export interface Candidate {
  id: number
  recruitment_id: number
  name: string
  email: string
  phone: string
  resume?: string
  status: string
  interview_date?: string
  interview_notes?: string
  observations?: string
  recruitment?: Recruitment
  created_at: string
}

export interface DashboardIndicators {
  total_employees: number
  active_employees: number
  inactive_employees: number
  birthdays_current_month: number
  total_costs: number
  total_benefits: number
  total_discounts: number
  overtime_minutes: number
  turnover_rate: number
}

export interface DashboardCharts {
  employees_by_department: { department: string; count: number }[]
  salary_distribution: { range: string; count: number }[]
  monthly_hires: { month: number; year: number; count: number }[]
  spending_by_department: { department: string; total: number }[]
  spending_by_position: { position: string; total: number }[]
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
}
