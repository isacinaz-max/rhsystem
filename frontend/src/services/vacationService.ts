import api from './api'

export const vacationService = {
  list: (params?: any) => api.get('/api/vacations', { params }),
  find: (id: number) => api.get(`/api/vacations/${id}`),
  create: (data: any) => api.post('/api/vacations', data),
  approve: (id: number) => api.put(`/api/vacations/${id}/approve`),
  reject: (id: number, data?: any) => api.put(`/api/vacations/${id}/reject`, data),
  report: (params?: any) => api.get('/api/vacations/report', { params }),
}
