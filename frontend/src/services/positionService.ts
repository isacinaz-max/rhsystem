import api from './api'

export const positionService = {
  list: (params?: any) => api.get('/api/positions', { params }),
  find: (id: number) => api.get(`/api/positions/${id}`),
  create: (data: any) => api.post('/api/positions', data),
  update: (id: number, data: any) => api.put(`/api/positions/${id}`, data),
  delete: (id: number) => api.delete(`/api/positions/${id}`),
}
