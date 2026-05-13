import api from './api'

export const benefitService = {
  list: (params?: any) => api.get('/api/benefits', { params }),
  find: (id: number) => api.get(`/api/benefits/${id}`),
  create: (data: any) => api.post('/api/benefits', data),
  update: (id: number, data: any) => api.put(`/api/benefits/${id}`, data),
  delete: (id: number) => api.delete(`/api/benefits/${id}`),
  assignBenefits: (employeeId: number, data: any) => api.post(`/api/employees/${employeeId}/benefits`, data),
  employeeBenefits: (employeeId: number) => api.get(`/api/employees/${employeeId}/benefits`),
}
