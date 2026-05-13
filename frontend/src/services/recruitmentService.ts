import api from './api'

export const recruitmentService = {
  list: (params?: any) => api.get('/api/recruitments', { params }),
  find: (id: number) => api.get(`/api/recruitments/${id}`),
  create: (data: any) => api.post('/api/recruitments', data),
  update: (id: number, data: any) => api.put(`/api/recruitments/${id}`, data),
  delete: (id: number) => api.delete(`/api/recruitments/${id}`),
}
