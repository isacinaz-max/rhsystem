import api from './api'

export const employeePayrollItemService = {
  list: (params?: any) => api.get('/api/employee-payroll-items', { params }),
  find: (id: number) => api.get(`/api/employee-payroll-items/${id}`),
  create: (data: any) => api.post('/api/employee-payroll-items', data),
  update: (id: number, data: any) => api.put(`/api/employee-payroll-items/${id}`, data),
  delete: (id: number) => api.delete(`/api/employee-payroll-items/${id}`),
  byEmployee: (employeeId: number) => api.get(`/api/employee-payroll-items/by-employee/${employeeId}`),
  toggleActive: (id: number) => api.patch(`/api/employee-payroll-items/${id}/toggle-active`),
}
