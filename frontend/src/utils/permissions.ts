export type Role = 'administrador' | 'rh' | 'gestor' | 'funcionario'

export function canManageUsers(role: Role): boolean {
  return role === 'administrador' || role === 'rh'
}

export function canManagePayroll(role: Role): boolean {
  return role === 'administrador' || role === 'rh'
}

export function canViewReports(role: Role): boolean {
  return role !== 'funcionario'
}

export function canManageRecruitment(role: Role): boolean {
  return role === 'administrador' || role === 'rh'
}

export function canApproveVacation(role: Role): boolean {
  return role === 'administrador' || role === 'rh' || role === 'gestor'
}
