import api from './api'

export const companyService = {
  list: (params?: any) => api.get('/api/companies', { params }),
  listAll: () => api.get('/api/companies/list-all'),
  find: (id: number) => api.get(`/api/companies/${id}`),
  create: (data: any) => api.post('/api/companies', data),
  update: (id: number, data: any) => api.put(`/api/companies/${id}`, data),
  delete: (id: number) => api.delete(`/api/companies/${id}`),
  uploadLogo: (id: number, file: FormData) => api.post(`/api/companies/${id}/logo`, file, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}
