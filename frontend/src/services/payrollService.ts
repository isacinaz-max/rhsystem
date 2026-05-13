import api from './api'

export const payrollService = {
  list: (params?: any) => api.get('/api/payrolls', { params }),
  find: (id: number) => api.get(`/api/payrolls/${id}`),
  generate: (data: any) => api.post('/api/payrolls/generate', data),
  generatePdf: (id: number) => api.get(`/api/payrolls/${id}/pdf`, { responseType: 'blob' }),
  export: (params?: any) => api.get('/api/payrolls/export', { params, responseType: 'blob' }),
  update: (id: number, data: any) => api.put(`/api/payrolls/${id}`, data),
  markAsPaid: (id: number, data?: any) => api.put(`/api/payrolls/${id}/pay`, data),
  recalculate: (id: number) => api.post(`/api/payrolls/${id}/recalculate`),
}
