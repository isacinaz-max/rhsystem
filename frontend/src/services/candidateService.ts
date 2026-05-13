import api from './api'

export const candidateService = {
  list: (params?: any) => api.get('/api/candidates', { params }),
  find: (id: number) => api.get(`/api/candidates/${id}`),
  create: (data: any) => api.post('/api/candidates', data),
  update: (id: number, data: any) => api.put(`/api/candidates/${id}`, data),
  delete: (id: number) => api.delete(`/api/candidates/${id}`),
}
