import api from './api'

export const departmentService = {
  list: (params?: any) => api.get('/api/departments', { params }),
  find: (id: number) => api.get(`/api/departments/${id}`),
  create: (data: any) => api.post('/api/departments', data),
  update: (id: number, data: any) => api.put(`/api/departments/${id}`, data),
  delete: (id: number) => api.delete(`/api/departments/${id}`),
}
